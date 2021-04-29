const { Schema, model, isValidObjectId } = require('mongoose')
const { maxStringLength } = require('../constants/common')

const calendar = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    exercise: [{
        _id: false,
        exerciseID: {
            type: Schema.Types.ObjectId,
            required: true
        },
        reps: {
            type: Array,
            default: [0]
        },
        weights: {
            type: Array,
            default: [0]
        }
    }],
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    color: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        max: maxStringLength,
        default: ''
    }
})

module.exports = model('Calendar', calendar) // 'Calendar' is just a name of the model, calendar is a Schema of this model