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

    // NOTE: there is no need to run command to create a Collection(table)
    // insertOne() takes 2 argv
    // 1: object you wanna insert
    // 2: the callback function when thing go south or well
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         // prevent the rest of the function executing (since it's already error out)
    //         return console.log('unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Eric Dao',
        age: 42,
        location: 'San Francisco'
    }, (err, result) => {
        if (err) {
            // prevent the rest of the function executing (since it's already error out)
            return console.log('unable to insert user', err);
        }
        console.log(result.ops[0]._id.getTimestamp());  // extract the timestamp from the object id generated by mongodb
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();     // be sure to close the connection
    // v3: client.close();
});
