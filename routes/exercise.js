const { Router } = require('express')
const User = require('../models/user')
const Region = require('../models/region')
const Exercise = require('../models/exercise')
const { maxStringLength } = require('../constants/common')

const router = Router()


router.post('/create-update-delete-exercise', async (req, res) => {
	try {

    	let response = {
    		validationErrors: {},
    		body: {}
    	}


    	const user = await User.findById(req.body.userID)
    	if(user === undefined) response.validationErrors.user = 'There is no such user'

	    const region = await Region.findById(req.body.regionID)
	    if(region === undefined) response.validationErrors.region = 'There is no such region'

	    const isValidExerciseID = Boolean(req.body.exerciseID.match(/^[0-9a-fA-F]{24}$/))
		if(req.body.exerciseID.length > 0 && isValidExerciseID !== true) response.validationErrors.exercise = 'The field exerciseID is not valid'

	    let exercise
	    if(req.body.exerciseID.length > 0 && isValidExerciseID) {
	    	exercise = await Exercise.findById(req.body.exerciseID)
	    	if(!exercise) response.validationErrors.exercise = 'You passed some exerciseID, but there is no such exercise'
	    }
	    
	    if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

	    let exerciseName = req.body.name
	    if(exerciseName.length > maxStringLength) exerciseName = exerciseName.slice(0, maxStringLength)

	   	if(exercise) {

	   		if(req.body.delete !== true) {
				exercise = await Exercise.findByIdAndUpdate(
					exercise._id,
					{
						regionID: req.body.regionID,
						name: exerciseName,
						showInUI: req.body.showInUI
					},
					{new: true} // return new object (with new token)
				)
	   		} else {
                exercise = await Exercise.findOneAndDelete({_id: exercise._id})
	   		}


	   	} else {
			exercise = new Exercise({
				userID: user._id,
				regionID: region._id,
				name: exerciseName,
				showInUI: req.body.showInUI
			})
			await exercise.save()
	   	}




  //   	const user = await User.findById(req.body.userID)
  //   	if(user === undefined) response.validationErrors.user = 'There is no such user'

	 //    const region = await Region.findById(req.body.regionID)
	 //    if(region === undefined) response.validationErrors.region = 'There is no such region'

	 //    const isValidExerciseID = Boolean(req.body.exerciseID.match(/^[0-9a-fA-F]{24}$/))
		// if(isValidExerciseID !== true) response.validationErrors.exercise = 'The field exerciseID is not valid'

	 //    let exercise
	 //    if(req.body.exerciseID.length > 0 && isValidExerciseID && (req.body.update === true || req.body.delete === true)) {
	 //    	exercise = await Exercise.findById(req.body.exerciseID)
	 //    	if(!exercise) response.validationErrors.exercise = 'You passed some exerciseID, but there is no such exercise'
	 //    }
	    
	 //    if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

	 //    let exerciseName = req.body.name
	 //    if(exerciseName.length > maxStringLength) exerciseName = exerciseName.slice(0, maxStringLength)

	 //   	if(exercise && req.body.update === true) {
		// 	exercise = await Exercise.findByIdAndUpdate(
		// 		exercise._id,
		// 		{
		// 			regionID: req.body.regionID,
		// 			name: exerciseName,
		// 			showInUI: req.body.showInUI
		// 		},
		// 		{new: true} // return new object (with new token)
		// 	)
	 //   	} else if(exercise && req.body.delete === true) {
	 //   		exercise = await Exercise.findByIdAndDelete(exercise._id)
	 //   	} else {
		// 	const exercise = new Exercise({
		// 		userID: user._id,
		// 		regionID: region._id,
		// 		name: exerciseName,
		// 		showInUI: true
		// 	})
		// 	await exercise.save()
	 //   	}

	 	if(req.body.delete !== true) {
	 		response.body.text = 'Exercise "' + exercise.name + '" was successfully saved'
	 	} else {
	 		response.body.text = 'Exercise "' + req.body.name + '" was deleted'
	 	}
	 	
		response.body.exercise = exercise
	    res.send(response)
	} catch (error) {
        console.log(error)
        res.send(error)
    }
})


router.get('/get-all/:userID/:tokenID', async (req, res) => {
	try {

    	let response = {
    		validationErrors: {},
    		body: {}
    	}

	    const user = await User.findById(req.params.userID)

	    if(user === undefined) response.validationErrors.user = 'There is no such user'
	    if(user !== undefined && user.tokenID !== req.params.tokenID) response.validationErrors.user = 'Token is not valid anymore'

	    if(Object.keys(response.validationErrors).length !== 0) return res.send(response)

	    const exercises = await Exercise.find({userID: req.params.userID})

		//@TODO: Update tokenID in `user` collection and then iupdate hive box `user` on flutter side

		response.body.exercises = exercises
	    res.send(response)
	} catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router