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

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });
    // we got lots of output, see top result object: ok = 1, n = 3 // number of records we were deleted

    // deleteOne - only delete the 1st match
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    //     console.log(result);
    // });
    // we got lots of output, see top result object: ok = 1, n = 1 // number of records we were deleted

    // findOneAndDelete -> let you delete individually, and also return the item so u can tell the user which one you delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    // deleteMany
    // db.collection('Users').deleteMany({name: 'Eric Dao'}).then((result) => {
    //     console.log(result);
    // });

    // 5bc1d4f493875331a492bc78
    // findOneAndDelete -> let you delete individually, and also return the item so u can tell the user which one you delete
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5bc1d4f493875331a492bc78')
        }).then((result) => {
        console.log(result);
    });

    // db.close();     // be sure to close the connection
    // v3: client.close();
});
