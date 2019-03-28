require('./config/config'); // sets all env configurations

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());

app.post('/api/todo', authenticate, (req, res) => {
    const model = new Todo({
        text: req.body.text,
        _createdBy: req.user._id
    });
    model.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/api/todos', authenticate ,(req, res) => {
    Todo.find({
        _createdBy: req.user._id
    }).then((models) => {
        res.send({data: models});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/api/todos/:id', authenticate ,(req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send('id is not valid!');
    Todo.findById(id).then((model) => {
        if (!model) return res.status(404).send('no object found matching this id!');
        res.status(200).send({data: model});
    }, (err) => {
        res.status(404).send(err);
    });
});

app.delete('/api/todos/:id', authenticate ,(req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(400).send('id is not valid!');
    Todo.findOneAndDelete({
        _id: id,
        _createdBy: req.user._id
    }).then((model) => {
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

app.patch('/api/todos/:id', authenticate ,(req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _createdBy: req.user._id
    },{
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

// signup user using email and password

app.post('/api/users/register', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    const user = new User({
        email: body.email,
        password: body.password
    });
    // const user = new User(body); // also valid
    user.save()
    .then((savedUser) => {
        return savedUser.generateAuthToken(); // causes then to call with token as argument
    }).then((token) => {
        // we set token as custom header prop key in res
        // x-auth is used to define custom header key instead of default header keys
        res.header('x-auth', token).status(200).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

// ger user by sending auth token in request header
app.get('/api/users/me', authenticate, (req, res) => {
    // because of authenticate middleware req contains user
    return res.status(200).send(req.user); 
});

// login using post
app.post('/api/users/login', (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);
    User.findByCredientials(body.email, body.password).then((user) => {
        // we have user, now we need to generate auth token
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });
    }).catch((err) => {
        res.status(404).send('User with specified email or password does not exists!');
    });
});

// logout using auth header
app.post('/api/users/logout', authenticate ,(req, res) => {
    // authenticate middleware sends user and token in req props
    const user = req.user;
    const token = req.token;
    // now we need to delete this token from user's tokens array
    user.logout(token).then((savedUser) => {
        res.status(200).send('logout success!');
    }).catch((err) => {
        res.status(400).send(err);
    });
});

const port = process.env.PORT; // see config.js
app.listen(port, 'localhost', () => {
    console.log(`listening on port ${port}...`);
});