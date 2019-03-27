const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const kACCESS = "Auth";
const kSECRET = "abc123";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // remove extra spaces
    unique: true, // no other doc should have same email prop
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not valid email!"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [ // is an array
    { // schema of objects in array
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// we can add methods to user instance by adding methods to user schema
UserSchema.methods.generateAuthToken = function() {
  // we use functions instead of arrow because this is available
  const user = this;
  const id = user._id.toHexString();
  const data = {
    _id: id,
    access: kACCESS
  };
  const token = jwt.sign(data, kSECRET).toString();
  const tokenObj = {
    access: kACCESS,
    token: token
  };
  user.tokens.push(tokenObj);
  return user.save().then(() => {
    // returning user.save() result which is a promise
    // because returning from a promise is also a promise, this helps chain then calls
    // returning token so caller of generateAuthToken can apply then to grab token
    return token; 
  });
};

UserSchema.methods.toJSON = function() {
  // we need to override this to send back only desired values to client
  // because by default all values including password, tokens array also send in response
  // this method allows us to pick specific values for response
  const user = this;
  const userObject = user.toObject(); // converts mongoose model into regular javascript obj
  return _.pick(userObject, ['_id', 'email']); // token send via header
};

// we can define class methods using statics instead of methods 
UserSchema.statics.findByToken = function(token) {
  // we can use this method to find a user based on provided token
  // if token is valid && available in some user's tokens array than we return user
  // otherwise we send back reject promise
  let User = this; // upper case User means class level
  let decoded;
  try { // if token is valid
    decoded = jwt.verify(token, kSECRET); 
  } catch (e) {
    return Promise.reject(e); // caller of function use catch block
  }
  // token is valid:- now decoded contains a token object with _id and access props
  return User.findOne({
    _id: decoded._id,
    "tokens.access": decoded.access, // whenever . appears in key we need to send as string
    "tokens.token": token // whenever . appears in key we need to send as string
  }); // send back promise, call of function use then block 
}

const User = mongoose.model("User", UserSchema);

module.exports = {
    User: User
}