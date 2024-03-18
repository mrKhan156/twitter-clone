const { validationResult } = require('express-validator');

//functions
const loginValidatorResult = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    try {
      return res.render('pages/login', {
        user: req.body ? req.body : {},
        error: mappedErrors,
      });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = loginValidatorResult;
