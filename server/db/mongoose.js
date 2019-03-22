// require mongoose
const mongoose = require('mongoose');
// enable promise in mongoose by providing it build in promise library
mongoose.Promise = global.Promise;
// create a URL where our database lives to which we want to connect
const kDBName = "ToDoApp";
const kMongoDBURL = `mongodb://localhost:27017/${kDBName}`;
const connectOptions = {
    useNewUrlParser: true,
};

module.exports = {
    mongoose : mongoose
}