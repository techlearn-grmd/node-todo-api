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
 
// you only get how many was removed, but didn't get the data (removed) back
Todo.remove({}).then((result) => {
    console.log(result);
}); // remove everything in the todo collection

// it will also return the data you remove
// Todo.findOneAndRemove({ _id: '5bc4491eba2bed5046679d75' }).then((doc) => {
//     console.log(doc);
// });

// Todo.findByIdAndRemove('5bc4a7a4d8f51b54b14ccebb').then((doc) => {
//     console.log(doc);
// }); 