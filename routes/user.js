const { Router } = require('express')
const router = Router()
const path = require('path')
const mongoose = require('mongoose')
const crypto = require('crypto')

const User = require('../models/user')
const UserRestorePassword = require('../models/user-restore-password')
const { mongoObjectIdGenerator, sleep } = require('../utils/development')
const { groupBy, sortByKey } = require('../utils/calendar')
const { generateToken } = require('../utils/user')
const { salt } = require('../constants/user')



// router.post('/send-restore-password-code', async (req, res) => {
// 	try {
// 		const nodemailer = require('nodemailer')

// 		let transporter = nodemailer.createTransport({
// 			service: 'gmail',
// 			auth: {
// 				user: 'y18021989@gmail.com',
// 				pass: 'y18021989y',
// 			},
// 		})

// 		let result = await transporter.sendMail({
// 			from: 'FIT LOGGER y18021989@gmail.com',
// 			to: 'loggerfit@gmail.com',
// 			subject: 'Code to restore password',
// 			// text: 'qweqweqeqweqwe ASDASDASDAD',
// 			html: 'This <i>message</i> with <strong>attachments</strong>.',
// 		})

// 		console.log(result)
// 		res.send('Works?')
// 	} catch (error) {
//         console.log(error)
//         res.send(error)
//     }
// })

router.get('/send-restore-password-code/:restorePasswordTokenID', async (req, res) => {
	try {
		const userRestorePassword = (await UserRestorePassword.find({tokenID: req.params.restorePasswordTokenID}))[0]
		if(userRestorePassword !== undefined) {
			user = await User.findOneAndUpdate(
				{email: userRestorePassword.email},
				{
					password: userRestorePassword.password,
					tokenID: generateToken()
				},
				{new: true} // return new object (with new token)
			)
			res.send('Your password was updated')
		} else {
			res.send('10 minutes expired, try again')
		}
		
	} catch (error) {
        console.log(error)
        res.send(error)
    }

})

router.post('/refresh-token', async (req, res) => {
	try{
		let response = {
			validationErrors: {},
			body: {}
		}

		const user = await User.findByIdAndUpdate(req.body.userID, {tokenID: generateToken()}, {new: true})
    	if(!user) response.validationErrors.user = 'There is no such user'
    	if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

		response.body.tokenID = user.tokenID
		response.body.userID = user._id
		response.body.lastUpdate = user.updated_at
		return res.send(response)
	} catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.post('/auth', async (req, res) => {
    try {
		let response = {
			validationErrors: {},
			body: {}
		}
		
		if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email.trim()))) response.validationErrors.email = 'Email is wrong'
		if(req.body.password.trim().length < 5) response.validationErrors.password = 'Password must have at least 5 characters'
		if(Object.keys(response.validationErrors).length !== 0) return res.send(response)


		const email = req.body.email.trim();
		const password = crypto.createHash('md5').update(salt + req.body.password.trim()).digest('hex')
		const restorePassword = req.body.restorePassword

		let user = (await User.find({email: email}))[0]
		if(user !== undefined) {
			if(restorePassword === false) {
				if(user.password !== password) response.validationErrors.password = 'Email exists, but password is wrong'
				if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

				// We can't use smth like `user = await user.updateOne({tokenID: generateToken()})`
				// Because in such case the result would be a result a mongoose object and not expected document

				// These two strings are doing the same as the method `findByIdAndUpdate`
				// await user.updateOne({tokenID: generateToken()})
				// user = (await User.find({email: email}))[0]

				user = await User.findByIdAndUpdate(
					user._id,
					{tokenID: generateToken()},
					{new: true} // return new object (with new token)
				)
			} else if(restorePassword === true) {
				const restorePasswordTokenID = generateToken();

				await UserRestorePassword.findOneAndDelete({email: user.email})

				const newUserRestorePassword = new UserRestorePassword({
					email: user.email,
					password: password,
					tokenID: restorePasswordTokenID
				})
				userRestorePassword = await newUserRestorePassword.save()

				

				const nodemailer = require('nodemailer')

				let transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'y18021989@gmail.com',
						pass: 'y18021989y',
					},
				})

				let result = await transporter.sendMail({
					from: 'FIT LOGGER y18021989@gmail.com',
					to: email,
					subject: 'Restore password',
					// text: 'qweqweqeqweqwe ASDASDASDAD',
					html: 'You have 10 minutes to click on this link to restore your password - <a href="http://localhost:3000/user/send-restore-password-code/' + restorePasswordTokenID + '">Restore password in the app Fit Logger',
				})

				response.body.text = 'Check your email and follow instructions'
				res.send(response)
			}
		} else {
			const newUser = new User({
				email: email,
				password: password,
				tokenID: generateToken()
			})
			user = await newUser.save()
		}

		if(Object.keys(response.validationErrors).length === 0) {
			response.body.userTokenID = user.tokenID
			response.body.userID = user._id
			response.body.lastUpdate = user.updated_at
		}

		// sleep(1000)
		return res.send(response)

    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

// router.get('/get-token/:userID', async (req, res) => {
//     const data = await User.find({ userID: req.params.userID })
//     console.log(data[0].tokenID)
//     res.send(data[0].tokenID)
//     // try {
//     //     const data = await Calendar.find({ userID: req.params.userID })
//     //     res.send(data)
//     // } catch (error) {
//     //     console.log(error)
//     // }
// })

module.exports = router