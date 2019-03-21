// create mongo client which than make a connection with mongo db server
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');

// create a URL where our database lives to which we want to connect
const kDBName = "ToDoApp";
const kMongoDBURL = `mongodb://localhost:27017/${kDBName}`;
// mongodb:// is the protocol to make a connection with mongo database
// localhost: // is the host for development, once deployed it can AWS or heroku
// 27017 is the port at which our mongod server is listening
// ToDoApp is the name of database residing in /data/db directory 

const connectOptions = {
  useNewUrlParser: true,
};

MongoClient.connect(kMongoDBURL, connectOptions, (err, client) => {
    if (err) {
        return console.log('unable to connect to database, ', err.message);
    } 
    console.log("connected to database successfully!");
    // get db from client
    const db = client.db(kDBName);
    /*
    db.createCollection('Todos', (err, collection) => {
        if (err) {
            return console.log('unable to create collection, ', err.message);
        } 
        console.log("collection created!");
        const doc = {
            text: 'do something else',
            completed: false
        };
        collection.insertOne(doc, (err, result) => {
            if (err) {
                return console.log('unable to insert document, ', err.message);
            }
            console.log("document inserted!", JSON.stringify(result.ops, undefined, 2));
            client.close(); // must be at inner most callback to avoid Topology was destroyed error
        });
    }); */

    db.createCollection('Users', (err, collection) => {
        if (err) {
            return console.log('unable to create collection, ', err.message);
        }
        console.log("collection created!");
        const doc = {
            name: 'Ali',
            age: 15,
            location: 'Lahore'
        };
        collection.insertOne(doc, (err, results) => {
            // results.ops is an array of docs returned
            if (err) {
                return console.log('unable to insert document, ', err.message);
            }
            console.log("document inserted!", JSON.stringify(results.ops, undefined, 2));
            client.close(); // must be at inner most callback to avoid Topology was destroyed error
        });
    });
});
