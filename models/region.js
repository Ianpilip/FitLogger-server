const { Schema, model } = require('mongoose')

const region = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = model('Region', region)