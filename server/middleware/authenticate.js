const {User} = require('../models/user');

// middleware to authenticate user and to make public routes private
const authenticate = (req, res, next) => {
    // we use class method of User
    const token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject(); // causes below catch to called
        }
        // add user and token as props of request object before calling next
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send('Authentication Failed!');
    });
}

module.exports = {
    authenticate : authenticate
}