// dependencies

const { check } = require('express-validator');
const User = require('../../modles/User');
const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const { updateCache } = require('../../utilitis/cacheManager');

//functions
const loginValidator = () => {
  return [
    check('username')
      .notEmpty()
      .toLowerCase()
      .trim()
      .withMessage('Username is required')
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({
            $or: [
              {
                username: value,
              },
              {
                email: value,
              },
            ],
          });
          if (user) {
            req.username = user.username;
            req.email = user.email;
            req.password = user.password;
            req.id = user._id;
            updateCache(`users:${user._id}`, user);

            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          throw createHttpError(500, error);
        }
      })
      .withMessage('User was not authenticated'),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom(async (password, { req }) => {
        if (!req.password) return true;
        try {
          const isValidUser = await bcrypt.compare(password, req.password);

          if (isValidUser) {
            req.validUser = true;
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          throw createHttpError(500, error);
        }
      })
      .withMessage('Password was Wrong !'),
  ];
};

module.exports = loginValidator;
