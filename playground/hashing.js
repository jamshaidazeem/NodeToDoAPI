
// crypto example
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

// hashing using bcryptjs lib example
const bcrypt = require("bcryptjs");
const password = 'abc123';
const saltRounds = 10; // def 10 but upto any number but takes more time
bcrypt.genSalt(saltRounds).then((salt) => {
    console.log(`salt  ==> ${salt} using ${saltRounds} rounds!`);
    bcrypt.hash(password, salt).then((hash) => {
        console.log(`hash to be saved in database ==> ${hash}`);
        // now we compare it with actual password
        bcrypt.compare(password, hash).then( (isMatched) => {
            console.log(`is matched ==> ${isMatched}`);
        }); 
    }).catch((err) => {
        console.log(`error in generating salt ==> ${err}`);
    });
}).catch((err) => {
    console.log(`error in generating salt ==> ${err}`);
});
