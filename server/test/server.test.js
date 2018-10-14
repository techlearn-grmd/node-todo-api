const expect = require('expect');
const request = require('supertest');   // note: request is set to supertest

const {app} = require('./../server');

// need model from todo to verify the todo is indeed added to the collection
const {Todo} = require('./../models/todo');

// our beforeEach() deletes all the data for post (item 1 to fix)
// but our get needs data to be there in collection to test (preseed item 2 to fix)
var todosMock = [{
    text: 'first todo'
}, {
    text: 'second todo'
}];

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
