const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// var User = mongoose.model('Users', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }
// });

// Schema property allows you to create a new schema so that to tag on custom method on it
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address!'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// instance method to access the doc, use regular function so we can access the 'this' keyword
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc');

    // add the newly generated token into the user object
    user.tokens = user.tokens.concat({access, token});

    // save the object
    user.save().then(() => {
        return token;       // so we can access the token later on (in the server.js to tag on another callback to allow chain on promise())
    });
    // .then((token) => {}) // happens in the server.js to chain on another then()
    // usually it returns a promise(), but return a var is perfectly fine
}

// filter out the property in the document to be returned to the post call
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();   // convert the mongoose object user into the regular object with doc property existed

    return _.pick(userObject, ['_id', 'email']);
}

var User = mongoose.model('Users', UserSchema);


// this also works, above is new syntax:
// validator: (value) => {
//     return validator.isEmail(value);
// },

module.exports = {User};