// models/user.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  try {
    if (!process.env.JWTPRIVATEKEY) {
      throw new Error('JWTPRIVATEKEY is not defined');
    }
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.error('JWT Generation Error:', error.message);
    throw new Error('Token generation failed');
  }
};

const User = mongoose.model('user', userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
  });
  return schema.validate(data);
};

module.exports = { User, validate };