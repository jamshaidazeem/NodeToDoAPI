const {ObjectID} = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = "5c98b900d14d4f30b389a826";

// if id is valid as per id protocol than catch block won't called instead you can get 
// null or [] empty array in case of find, 
// if id is not valid than catch block will be called with cast error

if (!ObjectID.isValid(id)) {
    console.log('id is not valid');
}

Todo.find({
    _id : id
}).then((docs) => {
    if (docs.length === 0) {
        console.log("id not found!");
    } else {
        console.log(`${docs}`);
    }
}).catch((err) => {
    console.log(`${err.message}`);
});

Todo.findOne({
    _id : id
}).then((doc) => {
    if (!doc) {
        return console.log("id not found!");
    } else {
        console.log(`${doc}`);
    }
}).catch((err) => {
    console.log(`${err.message}`);
});

Todo.findById(id).then((doc) => {
    if (!doc) {
        return console.log("id not found!");
    } else {
        console.log(`${doc}`);
    }
}).catch((err) => {
    console.log(`${err.message}`);
}); 




