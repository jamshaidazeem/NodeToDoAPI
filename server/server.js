const express = require('express');
const body-parser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.listen(3000, 'localhost', () => {
    console.log('listening on port 3000...');
});