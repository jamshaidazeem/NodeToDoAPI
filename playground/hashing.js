const {SHA256} = require('crypto-js');

const txt = "i am user number 3";
const hash = SHA256(txt).toString();

console.log(`txt ==> ${txt}`);
console.log(`hash ==> ${hash}`);

const jwt = require('jsonwebtoken');
const data = {
    id : 10
};
const VERIFICATION_KEY = 'abc123'; // must be saved on server
const token = jwt.sign(data, VERIFICATION_KEY);
console.log(`token ==> ${token}`);
const decodedToken = jwt.verify(token, VERIFICATION_KEY);
console.log(`decoded token ==> ${JSON.stringify(decodedToken)}`);





