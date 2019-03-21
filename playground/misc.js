const {MongoClient, ObjectID} = require('mongodb');

// object destructering es6 example
const obj = {name: 'abc', age: 13};
const {name} = obj;
console.log(`obj name prop is ${name}`); 

// each doc inside mongo collection has _id prop which is of type object 
// we can access its props and can also call methods like to get created at timestamp
const objId = new ObjectID();
console.log(`objId is ${objId}`); 
console.log(`objId created on ${objId.getTimestamp()}`);