const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.post('/api/todo', (req, res) => {
    const model = new Todo({
        text: req.body.text
    });
    model.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err.message);
    });
});

app.get('/api/todos', (req, res) => {
    Todo.find().then((models) => {
        res.send({data: models});
    }, (err) => {
        res.status(400).send(err.message);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, 'localhost', () => {
    console.log(`listening on port ${port}...`);
});