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

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bc1d51cac557652fc9ecc45')
    //     }, {
    //     $set: {
    //         completed: true
    //     }
    //     },{
    //     returnOriginal: false
    //     }).then((result) => {
    //         console.log(result);
    //     });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bc08b8c9657c62f56e96c56')   
        }, {
        $set: {
            name: 'Eric'
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    // db.close();     // be sure to close the connection
    // v3: client.close();
});
