// dependencies
const { Router } = require('express');
const {
  getLogin,
  getRegister,
  register,
} = require('../../controllers/auth/authController');
const dotenv = require('dotenv');
const decorateResponse = require('../../middlewares/common/decorateResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');
const { check } = require('express-validator');
const User = require('../../modles/User');
const signupValidator = require('../../middlewares/auth/signupValidator');
const signupValidationResult = require('../../middlewares/auth/signValidationResult');
const router = Router();

//config
dotenv.config();
// getlogin router
router.get(
  '/login',
  decorateResponse(`Login - ${process.env.APP_NAME}`),
  getLogin
);

// get resters routes
router.get(
  '/register',
  decorateResponse(`Register - ${process.env.APP_NAME}`),
  getRegister
);

// register routes handler

router.post(
  '/register',
  decorateResponse(`Register - ${process.env.APP_NAME}`),
  avatarUpload,
  signupValidator(),
  signupValidationResult,
  register
);
module.exports = router;
