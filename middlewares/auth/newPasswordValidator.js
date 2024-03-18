const { check } = require('express-validator');

const newPasswordValidator = [
  check('password')
    .isStrongPassword()
    .withMessage('password is not strong')
    .custom((val, { req }) => {
      req.password = val;
      return true;
    }),
  check('confirmPassword')
    .custom((val, { req }) => {
      const password = req.password;
      if (val === password) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('password is not matching'),
];

module.exports = newPasswordValidator;
