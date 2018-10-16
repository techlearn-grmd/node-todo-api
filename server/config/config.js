// process.env.NODE_ENV -> env popular by express, heroku set this to "production"
// 3 env total: 
// 1. heroku (production)
// 2. develop local (development)
// 3. run app thru mocha test (test)
// should use env to drive db connection, not a hardcoded connection string

// NODE_ENV -> for test, we need to config this in package.json (to set to test when npm run test is run)
var env = process.env.NODE_ENV || "development";     // currently only set by heroku (production), and test in package.json (test)

console.log('env: ', env);

// these will not be run by heroku as env will be set to "production"
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';      // using test db so it doesn't wipe out the data
}
