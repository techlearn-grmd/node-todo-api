// const MongoClient = require('mongodb').MongoClient;
// extract both MongoClient, ObjectID from mongodb
const {MongoClient, ObjectID} = require('mongodb');

// ObjectID constructor function allows us to create our own id
// var objId = new ObjectID();
// console.log(objId); // you will it generate an new unique object id everytime you call objId

// 2 argv: 
// 1) url is where the db lives (ip:port/database)
// 2) callback fires when connection succeeded/failed.  1st err (arg), 2nd db (db obj to do r/w data)
// v3: MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) -> {
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        // prevent the rest of the function executing (since it's already error out)
        return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    // v3: const db = client.db('TodoApp');

    // find() returns a cursor (pointer) to the result
    // toArray() converts the result into an array of documents, but it returns a Promise()
    // first callback for things go right, 2nd callback for the error case
    // db.collection('Todos').find({
    //     _id: new ObjectID('5bc08b16aef4f22f50ca0273')
    //     }).toArray().then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log(err);
    //     });

    // db.collection('Todos').find().count().then((count) => {
    //         console.log(`Todos count: ${count}`);
    //     }, (err) => {
    //         console.log(err);
    //     });

    db.collection('Users').find({
        name: 'Eric Dao'
        }).toArray().then((docs) => {
            console.log('Users');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log(err);
        });

        // db.close();     // be sure to close the connection
    // v3: client.close();
});
