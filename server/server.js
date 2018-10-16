require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

var app = express();
const port = process.env.PORT;  // see config/config.js local -> 3000, heroku -> set by env

// body-parser -> take json -> jscript object and attach to the request object 
// use the middleware to do the conversion
app.use(bodyParser.json()); // return value is a function to give to express

// POST -> allow us to *Create* new todo
// CRUD, when u create a resource, use POST, and send resource as body (JSON with text property)
app.post('/todos', (request, response) => {
    // console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((todo) => {
        response.send(todo);
    }, (e) => {
        response.status(400).send(e);
    });
});

// Read in cRud operation
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

// Read in cRud operation
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

// Patch in crUd operation (update)
app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;     // read the id off of the request object
    
    // this is where the update is stored, since anyone can send any property of any type or value they want in the request
    // e.g. completedAt (valid property, not is NOT settable)
    // so we use _.pick (take an object, and list of property to pick off from that object) to filter the settable properties
    var body = _.pick(request.body, ['text', 'completed']);

    // Check if the id is of the right format
    if (!ObjectID.isValid(id)) {
        return response.status(404).send(); 
    }

    // Check the completed property to see if it's boolean and if it's true
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();        // getTime() returns just a number of millisec from 1/1/1970 (unix epoc)
    } else {
        body.completed = false;             // if completed set to false, clear the completedAt timestamp
        body.completedAt = null;
    }

    // findByIdAndUpdate()
    Todo.findByIdAndUpdate(id, 
        {$set: body},                       // body is already a filtered object, use it as is
        {new: true}).then((todo) => {       // new to tell mongoose to return the new object, not the original
            if (!todo) {                    // if no such document in collection, return 404
                return response.status(404).send();
            }

            response.send({todo});
        }).catch((e) => {                   // for other error, return 404
            response.status(404).send();
        });
});

// Delete in cruD operation
// delete route
app.delete('/todos/:id', (request, response) => {
    // get the id
    var id = request.params.id;

    // Validate id use isValid
    // response with 404 if id not found, and send back an empty body
    if (!ObjectID.isValid(id)) {
        return response.status(404).send(); // return error and prevent further processing
    }

    // remove todo by id, use findByIdAndRemove
    Todo.findByIdAndRemove(`${id}`).then((todo) => {
        // Success
            // if no todo, return 404
            if (!todo) {
                return response.status(404).send();
            }
            // if todo, return 200 with todo
            response.status(200).send({todo});
    }, (e) => {
        // Error
            // 400 without body
            response.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`started on ${port}`);
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
// newTodo.save().then((todo) => {
//     console.log(`Todo: ${todo}`);
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