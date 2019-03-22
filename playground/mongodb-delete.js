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
    /* delete many
    db.collection('Todos').deleteMany({completed: false}, (err, result) => {
        if (err) {
            return console.log(`catch ${err.message}`);
        }
        console.log(result.result);
    }); */
    /* delete one
    db.collection('Todos').deleteOne({text: 'task 5'}, (err, result) => {
        if (err) {
          return console.log(`catch ${err.message}`);
        }
        console.log(result.result);
    }); */
    // findone and delete
    db.collection('Todos').findOneAndDelete({ text: 'task 3' }, (err, result) => {
        if (err) {
            return console.log(`catch ${err.message}`);
        }
        console.log(result);
    });
    // client.close();
});