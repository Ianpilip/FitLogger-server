// Execute it by console command `node migrations/region.js`

const mongoose = require('mongoose')

const Region = require('../models/region')
const { region } = require('../constants/region')
const { url } = require('../constants/mongodb.js');

(async function() {
	await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
	const result = await Promise.all(region.map(async (regionName) => {
		const newRegion = new Region({
			name: regionName
		})
		await newRegion.save()
	}))
	process.exit(1)
}())