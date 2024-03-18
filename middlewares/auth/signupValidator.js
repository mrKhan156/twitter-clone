const { check } = require('express-validator');
const User = require('../../modles/User');

const signupValidator = () => {
  return [
    //first Name
    check('firstName').trim().notEmpty().withMessage('First Name is Require!'),
    //last Name
    check('lastName').trim().notEmpty().withMessage('Last Name is Require!'),

    //username
    check('username')
      .trim()
      .notEmpty()
      .withMessage('Username is Require!')
      .custom(async (val, { req }) => {
        try {
          const user = await User.findOne({ username: val }, { username: 1 });
          if (user) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (err) {
          throw err;
        }
      })
      .withMessage('Username is already in use'),
    //email
    check('email')
      .toLowerCase()
      .trim()
      .notEmpty()
      .withMessage('Email is Require!')
      .isEmail()
      .withMessage('Email is invalid')
      .custom(async (val, { req }) => {
        try {
          const user = await User.findOne({ email: val }, { email: 1 });
          if (user) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (err) {
          throw err;
        }
      })
      .withMessage('Email is already in use'),
    //password
    check('password')
      .notEmpty()
      .withMessage('password is Require!')
      .isStrongPassword()
      .withMessage('Password is not strong'),

    //confirm password
    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is Require!')
      .isStrongPassword()
      .withMessage('Password is not strong')
      .custom((val, { req }) => {
        const pass = req.body.password;
        if (val === pass) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage('Password is not matching'),
  ];
};

module.exports = signupValidator;
