// const {SHA256} = require('crypto-js');

// var message = 'This is a plain text message';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// };

// token.data.id = 5;
// // user doesn't know about the "salt" ('some secret') that we added
// token.hash = SHA256(JSON.stringify(data)).toString()

// console.log('data: ', JSON.stringify(token.data));
// console.log('token: ', JSON.stringify(token));

// var resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString();
// if (resultHash === token.hash) {
//     console.log('data not changed');
// } else {
//     console.log('data was changed, not trust');
// };

// output:
// data:  {"id":5}
// token:  {"data":{"id":5},"hash":"e8e98768123683faf07ea4586bb803ae43def7f89bf7887be08af614bd910827"}
// data was changed, not trust

const jwt = require('jsonwebtoken');
// jwt.sign -> give data, return the token
// jwt.verify -> make sure data not manipulated.

var data = {
    id: 10
};

// token is given to the user when they sign in
// 2nd param is the "salt" secret 
var token = jwt.sign(data, '123abc');
console.log(token);     // long string

// https://jwt.io
// paste the token 0> see decode
// header: algo used
// payload: id, iat (issue at time stamp when token created)
// verify signature, need to put in our token to verify

var decoded = jwt.verify(token, '123abc');
console.log(decoded);    