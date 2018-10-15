const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// better object id validation:
const {ObjectID} = require('mongodb');

// grab an id from a doc in the todos collection
// 5bc36e9e8b90f347d9fd371e - second todo
// 5bc41632ac557652fc9ef77d - user: _id: "email@email.com"
var id = '5bc41632ac557652fc9ef77d';

if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
}
 
// Todo.find({
//     _id: id
//     }).then((todos) => {
//         console.log('Todos: ', todos);
//     });

// only return 1 even if it has > 1
// if you know you only need to fetch one, use findOne as it return the doc instead of an array
// u get null back instead of empty array if id not found
// Todo.findOne({
//     _id: id // it will convert the string into an object id by mongoose
//     }).then((todo) => {     // return just single document
//         console.log('Todo: ', todo);
//     });

// if you look for doc by id
// Todo.findById(id).then((todo) => {     // return just single document
//         if (!todo) {
//             console.log('Id not found');
//         } else {
//             console.log('Todo: ', todo);
//         }
//     }).catch((e) => console.log(e));

// doc: mongoosejs.com/docs/queries.html 

// challenge:
// query users collection
// need users mongoose model
// use by findById - no user, was found (print to screen), error might occur
User.findById(id).then((user) => {     // return just single document
    if (!user) {
        return console.log('Id not found');
    }
    console.log('User: ', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
