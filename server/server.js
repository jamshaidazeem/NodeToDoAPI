const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

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
        res.status(400).send(err);
    });
});

app.get('/api/todos', (req, res) => {
    Todo.find().then((models) => {
        res.send({data: models});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send('id is not valid!');
    Todo.findById(id).then((model) => {
        if (!model) return res.status(404).send('no object found matching this id!');
        res.status(200).send({data: model});
    }, (err) => {
        res.status(404).send(err);
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send('id is not valid!');
    Todo.findByIdAndDelete(id).then((model) => {
        if (!model) return res.status(404).send('no object found matching this id!');
        res.status(200).send({ data: model });
    }, (err) => {
        res.status(404).send(err);
    });
});

// update using patch method
// user send us id of document and in body send us props to update
// we can't let user update every property so we use lodash pick method to pick only valid props
// if task is completed than we update completed time stamp and vice versa
// we than use findbyidandupdate method and mongoose update operators 

app.patch('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send('id is not valid!');

    let body = _.pick(req.body, ['text', 'completed']);
    if (_.isBoolean(body.completed)) { 
        if (body.completed === true) {
            body.completedAt = new Date().getTime();
        } else {
            body.completedAt = null;
        }  
    } else {
       body = _.omit(body, ["completed"]); // in case completed is not valid we omit it
    } 

    Todo.findByIdAndUpdate(id,{
        $set : body
    }, {
        new : true // send back updated object
    }).then((model) => {
        if (!model) return res.status(404).send('no object found matching this id!');
        res.status(200).send({ data: model });
    }, (err) => {
        res.status(404).send(err);
    });
});


const port = process.env.PORT || 3000;
app.listen(port, 'localhost', () => {
    console.log(`listening on port ${port}...`);
});