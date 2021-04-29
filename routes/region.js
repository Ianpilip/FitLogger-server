const { Router } = require('express')
const router = Router()
const Region = require('../models/region')


router.get('/get-all', async (req, res) => {
	try {
		let response = {body: {}}
	    const regions = await Region.find({})
		response.body.bodyRegions = regions
	    res.send(response)
	} catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router