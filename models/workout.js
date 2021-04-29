const { Schema, model } = require('mongoose')

const workout = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    exerciseIDs: {
        type: Array,
        required: true
    }
})

module.exports = model('Exercise', exercise)