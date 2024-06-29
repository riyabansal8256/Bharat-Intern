// routes/auth.js
const router = require('express').Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      console.error('Validation Error:', error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.error('Authentication Error: Invalid Email');
      return res.status(401).send({ message: 'Invalid Email or Password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      console.error('Authentication Error: Invalid Password');
      return res.status(401).send({ message: 'Invalid Email or Password' });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

module.exports = router;