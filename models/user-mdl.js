const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 60,
    unique: true
  },
  password: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 60
  },
  accountnumber: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 60
  },
  emailaddress: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 60
  },
  identitynumber: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 60
  }
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ username: this.username, accountnumber: this.accountnumber }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('tm_user', userSchema, 'tm_user');

const fieldsUser = {
  "username":"$username",
  "accountnumber":"$accountnumber",
  "emailaddress":"$emailaddress",
  "identitynumber":"$identitynumber"
}

function validateUserAdd(user) {
  const schema = Joi.object({
    username: Joi.string().min(1).max(60).required(),
    password: Joi.string().min(1).max(60).required(),
    accountnumber: Joi.string().min(1).max(80).required(),
    emailaddress: Joi.string().min(1).max(80).required(),
    identitynumber: Joi.string().min(1).max(255).required()
  });

  return schema.validate(user); 
}

function validateUserEdit(user) {
  const schema = Joi.object({
    accountnumber: Joi.string().min(1).max(60).required(),
    emailaddress: Joi.string().min(1).max(60).required(),
    identitynumber: Joi.string().min(1).max(60).required(),
  });

  return schema.validate(user); 
}

function validateUserLogin(user) {
  const schema = Joi.object({
    username: Joi.string().min(1).max(60).required(),
    password: Joi.string().min(1).max(60).required()
  });

  return schema.validate(user); 
}

exports.User = User; 
exports.validateUserAdd = validateUserAdd;
exports.validateUserEdit = validateUserEdit;
exports.validateUserLogin = validateUserLogin;
exports.fieldsUser = fieldsUser;