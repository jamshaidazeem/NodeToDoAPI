const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  const access = "Auth";
  const data = {
    _id: id,
    access: access
  };
  const secret = 'abc123';
  const token = jwt.sign(data, secret).toString();
  const tokenObj = {
    access: access,
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
  const userObject = user.toObject(); // converts mongoose model into regular javacript obj
  return _.pick(userObject, ['_id', 'email']); // token send via header
};

const User = mongoose.model("User", UserSchema);

module.exports = {
    User: User
}