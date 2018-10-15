const expect = require('expect');
const request = require('supertest');   // note: request is set to supertest
const {ObjectID} = require('mongodb');

const {app} = require('./../server');

// need model from todo to verify the todo is indeed added to the collection
const {Todo} = require('./../models/todo');

// our beforeEach() deletes all the data for post (item 1 to fix)
// but our get needs data to be there in collection to test (preseed item 2 to fix)
const todosMock = [{
    _id: new ObjectID(),
    text: 'first todo 1'
}, {
    _id: new ObjectID(),
    text: 'second todo 2'
}]

// testing lifecycle that will run before each test cases
beforeEach((done) => {
    Todo.remove({}).then(() => {    // {} will remove all doc in the Collections
        return Todo.insertMany(todosMock);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'some todo item';

        // supertest syntax
        request(app)
            .post('/todos')         // calling post to /todos route
            .send({text})           // sending object (json) with text
            .expect(200)            // expect status code == 200 to return
            .expect((result) => {     // what we want to see is the returned body has the same text property we sent over
                expect(result.body.text).toBe(text);
            })
            .end((err, result) => {   // we are not done yet, we want to check if there is any error
                if (err) {            // if error, then
                    return done(err); // return to stop further processing
                }
                // we want to check if the db has updated with the test post
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);       // there should only be 1 entry
                    expect(todos[0].text).toBe(text);   // that entry to be of text passed in
                    done();
                }).catch((e) => done(e));   // catch all Errors
            });    
    });

    // need 1 more test case to ensure todo is not added if we passed in bad data
    it('should not create todo with invalid body data', (done) => {
        // supertest syntax
        request(app)
            .post('/todos')         // calling post to /todos route
            .send()                 // sending nothing
            .expect(400)            // expect status code == 400 to return
            .end((err, result) => {   // we are not done yet, we want to check if there is any error
                if (err) {            // if error, then
                    return done(err); // return to stop further processing
                }
                // we want to check that the db should NOT updated with the test post
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);       // there should only be 0 entry
                    done();
                }).catch((e) => done(e));   // catch all Errors
            });    
    });
});

describe('GET /todos', () => {
    it('should get all todo in the collection in body data', (done) => {
        // supertest syntax
        request(app)
            .get('/todos')         // calling post to /todos route
            .expect(200)            // expect status code == 200 to return
            .expect((result) => {
                expect(result.body.todos.length).toBe(2);
            })
            .end(done); // since we are not doing anything async, just pass in done    

    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todosMock[0]._id.toHexString()}`)        // toHexString() converts the ObjectID to a string
        .expect(200)                                            // expect status code == 200 to return
        .expect((result) => {
            expect(result.body.todo.text).toEqual(todosMock[0].text);
        })
        .end(done); // since we are not doing anything async, just pass in done
    });

    it('should return a 404 if todo not found', (done) => {
        // make request with NEW real object id - valid but not in collection
        var newHexId = new ObjectID().toHexString();

        // make sure you got a 404 back
        request(app)
        .get(`/todos/${newHexId}`)
        .expect(404)
        .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        // make request with an invalid but not in collection
        // /todos/123
        var newHexId = new ObjectID(123).toHexString();

        // make sure you got a 404 back
        request(app)
            .get(`/todos/${newHexId}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', (done) => {
    // should remove a todo
    it('should remove a todo', (done) => {
        var newHexId = todosMock[1]._id.toHexString();

        request(app)
        .delete(`/todos/${newHexId}`)
        .expect(200)
        .expect((result) => {
            expect(result.body.doc._id).toEqual(newHexId);
        })
        .end((error, result) => {
            if (error) {
                return done(error);
            }

            // after it's been removed
            // query database using findbyId toNotExist() in expect library
            Todo.findById(newHexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done());
        });
    });
    
    // should return 404 if todo not found
    it('should return 404 if todo not found', (done) => {
        // make request with NEW real object id - valid but not in collection
        var newHexId = new ObjectID().toHexString();

        // make sure you got a 404 back
        request(app)
            .delete(`/todos/${newHexId}`)
            .expect(404)
            .end(done);
    });

    // should return 404 if object id is invalid
    it('should return 404 if object id is invalid', (done) => {
        // make request with an invalid but not in collection
        // /todos/123
        var newHexId = new ObjectID(123).toHexString();

        // make sure you got a 404 back
        request(app)
            .delete(`/todos/${newHexId}`)
            .expect(404)
            .end(done);
    });

});
