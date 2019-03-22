const { MongoClient, ObjectID } = require('mongodb');
const kDBName = "ToDoApp";
const kMongoDBURL = `mongodb://localhost:27017/${kDBName}`;
const connectOptions = {
    useNewUrlParser: true,
};

// find method basically returns a cursor (pointer) to all the documents, we can call 
// many functions on cursor e.g toArray etc
// see full documentation of available cursor methods
// http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#toArray

MongoClient.connect(kMongoDBURL, connectOptions, (err, client) => {
    if (err) {
        return console.log(`unable to connect ${err.message}`);
    }
    const db = client.db(kDBName);
    // update using update method
    // we need to use update operators to make it work
    // query google for mongo update operators and see document for all 
    // update using set operator
    db.collection('Todos').findOneAndUpdate({
       // filter 
       _id: new ObjectID('5c948db52973480784b593d4')
    }, {
        // update fields
        $set: {completed: true}
    }, {
        // options
        returnOriginal : false
    }).then((result) => {
        console.log(`result todos ==> ${JSON.stringify(result, undefined, 2)}`);
    }, (err) => {
        return console.log(`unable to connect ${err.message}`);
    });
    // update user name and increment age field
    db.collection('Users').findOneAndUpdate({
       // filter 
       _id: new ObjectID('5c937bd4aa746a02eddf762c')
    }, {
        // update fields
        $set: {name: 'Hussain'},
        $inc: {age: 10}
    }, {
        // options
        returnOriginal : false
    }).then((result) => {
        console.log(`result users ==> ${JSON.stringify(result, undefined, 2)}`);
    }, (err) => {
        return console.log(`unable to connect ${err.message}`);
    });
    // client.close();
});