var mongoose = require('mongoose');

// same collection can have different document
// mongoose is more organized than that
// create a mongoose model to store our data
// no need to have createdAt as it's already in the _id
// let's have a simple model, just specify the type
var Todo = mongoose.model('Todos', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};