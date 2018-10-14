var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

// body-parser -> take json -> jscript object and attach to the request object 
// use the middleware to do the conversion
app.use(bodyParser.json()); // return value is a function to give to express

// POST -> allow us to create new todo
// CRUD, when u create a resource, use POST, and send resource as body (JSON with text property)
app.post('/todos', (request, response) => {
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((doc) => {
        response.send(doc);
    }, (e) => {
        response.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('started on 3000');
});

// ** start ** refactored to mongoose.js **
// var mongoose = require('mongoose');

// // tell mongoose to tell which Promise to use - we want to use built-in promise
// mongoose.Promise = global.Promise;

// // use mongoose to connect to the db
// // mongoose will maintain the connection for us
// mongoose.connect('mongodb://localhost:27017/TodoApp');
// ** end ** refactored to mongoose.js **

// ** start ** refactored to models/todo.js **
// same collection can have different document
// mongoose is more organized than that
// create a mongoose model to store our data
// no need to have createdAt as it's already in the _id
// let's have a simple model, just specify the type
// var Todo = mongoose.model('Todos', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });
// ** end ** refactored to models/todo.js **

// example of creating a brand new todo
// var Todo returned from model above
// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// var newTodo = new Todo({
//     text: ' Eat Apple'
// });

// Above won't write to db, need to call save (which returns a Promise)
// newTodo.save().then((doc) => {
//     console.log(`Todo: ${doc}`);
// }, (err) => {
//     console.log(err);
// });

// ** start ** refactored to models/user.js **
// var User = mongoose.model('Users', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }
// });
// ** end ** refactored to models/user.js **

// Sample create scripts
// var newUser = new User({
//     email: ' yeah@example.com '
// });

// newUser.save().then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
// }, (err) => {
//     console.log(err);
// });