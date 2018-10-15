var mongoose = require('mongoose');

// tell mongoose to tell which Promise to use - we want to use built-in promise
mongoose.Promise = global.Promise;

// use mongoose to connect to the db
// mongoose will maintain the connection for us
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// Adding process.env.MONGODB_URI to compat with HEROKU
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
module.exports = {mongoose};