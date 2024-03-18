const { validationResult } = require('express-validator');

const newPasswordValidationResult = (req, res, next) => {
  try {
    console.log('result');
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.render('pages/createNewPassword', {
        errors: mappedErrors,
        otp: {
          otpId: req.body.otpId,
          otp: req.body.otp,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = newPasswordValidationResult;
