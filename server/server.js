var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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

app.get('/todos', (request, response) => {
    // Todo.find().then((todos) => {
    //     response.send({
    //         todos,
    //         customCode: 1   // don't just send an array, put array in object so u can tag along returned customer property
    //     })
    Todo.find().then((todos) => {
        response.send({todos})
    }, (e) => {
        response.status(400).send(e);
    });
});

// GET /todos/12345678 <- last is dynamic
// id variable in the request object
// request.params is a key:value pair
app.get('/todos/:id', (request, response) => {
    // response.send(request.params);      // the params object has "id":"123"
    var id = request.params.id;

    // Validate id use isValid
    // response with 404 if id not found, and send back an empty body
    if (!ObjectID.isValid(id)) {
        return response.status(404).send(); // return error and prevent further processing
    }

    // findbyId() -> query todo collection looking for a match
    Todo.findById(id).then((todo) => {
        // if no todo, send back 404 with empty body
        if (!todo) {
            return response.status(404).send();
        }
        // success case
        // if todo - send it back
        response.status(200).send({todo});
    }).catch((e) => {
        // error case 
        // 400 - (don't send the error object back, just empty object)
        response.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('started on 3000');
});

module.exports = {app};
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