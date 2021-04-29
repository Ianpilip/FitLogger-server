const { Schema, model } = require('mongoose')
const { region } = require('../constants/region')
const { maxStringLength } = require('../constants/common')

const exercise = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    regionID: {
        type: Schema.Types.ObjectId,
        retuired: true
    },
    name: {
        type: String,
        required: true,
        max: maxStringLength
    },
    showInUI: {
        type: Boolean,
        required: true,
    }
})

module.exports = model('Exercise', exercise)