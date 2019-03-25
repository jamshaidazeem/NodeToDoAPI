// require mongoose
const mongoose = require('mongoose');
// enable promise in mongoose by providing it build in promise library
mongoose.Promise = global.Promise;
// create a URL where our database lives to which we want to connect
const kDBName = "ToDoApp";
const kMongoDBURL = process.env.MONGODB-URI || `mongodb://localhost:27017/${kDBName}`;
const connectOptions = {
    useNewUrlParser: true,
};

mongoose.connect(kMongoDBURL, connectOptions, (err) => {
    if (err) {
        return console.log('unable to connect to database, ', err.message);
    }
    console.log("connected to database successfully!");
});

module.exports = {
    mongoose : mongoose
}