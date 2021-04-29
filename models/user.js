const { Schema, model } = require('mongoose')

const validateEmail = email => {
    const match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return match.test(email)
};


const schemaOptions = {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const user = new Schema({
    email: {
        type: String,
        required: [true],
		validate: {
			validator: email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
			message: '{VALUE} is not a valid email address'
		},
		unique: true
    },
    password: {
    	type: String,
    	required: [true],
    },
    tokenID: {
        type: String,
        required: true
    }
}, schemaOptions)

module.exports = model('User', user)