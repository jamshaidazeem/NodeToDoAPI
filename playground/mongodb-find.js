const {MongoClient, ObjectID} = require('mongodb');
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
    // find all
    db.collection('Todos').find().toArray().then((result) => {
        console.log(`result ${JSON.stringify(result, undefined, 2)}`);
    }, (err) => {
        console.log(`catch ${err.message}`);
    });
    // find by value 
    db.collection('Todos').find({completed: false}).toArray().then((result) => {
        console.log(`result find by value ${JSON.stringify(result, undefined, 2)}`);
    }, (err) => {
        console.log(`catch ${err.message}`);
    });
    // find by _id
    const docId = new ObjectID("5c9375bcfe39db028a916b64");
    db.collection('Todos').find({ _id: docId }).toArray().then((result) => {
        console.log(`result find by id ${JSON.stringify(result, undefined, 2)}`);
    }, (err) => {
        console.log(`catch ${err.message}`);
    });
    // find by count
    db.collection('Todos').find().count().then((count) => {
        console.log(`result count ${JSON.stringify(count, undefined, 2)}`);
    }, (err) => {
        console.log(`catch ${err.message}`);
    });
   // client.close();
});