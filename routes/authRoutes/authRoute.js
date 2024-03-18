// dependencies
const { Router } = require('express');
const { register } = require('../../controllers/auth/authController');
const dotenv = require('dotenv');
const decorateResponse = require('../../middlewares/common/decorateResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');
const { check } = require('express-validator');
const User = require('../../modles/User');
const signupValidator = require('../../middlewares/auth/signupValidator');
const signupValidationResult = require('../../middlewares/auth/signValidationResult');
const getLogin = require('../../controllers/auth/getLogin');
const getRegister = require('../../controllers/auth/getRegister');
const emailConfirmation = require('../../controllers/auth/emailConfirmation');
const loginController = require('../../controllers/auth/loginController');
const loginValidator = require('../../middlewares/auth/loginDataValidator');
const loginValidatorResult = require('../../middlewares/auth/loginValidatorResult');
const loginChecker = require('../../middlewares/common/loginChecker');
const logOut = require('../../controllers/auth/logOut');
const getResetPasswordPage = require('../../controllers/auth/getResetPasswordPage');
const resetPassword = require('../../controllers/auth/ResetPassword');
const verifyOtp = require('../../controllers/auth/verifyOtpController');
const createNewPassword = require('../../controllers/auth/createNewPassword');
const newPasswordValidator = require('../../middlewares/auth/newPasswordValidator');
const newPasswordValidationResult = require('../../middlewares/auth/newPasswordValidatorResult');

const router = Router();

//config
dotenv.config();
// getlogin router
router.get(
  '/login',
  decorateResponse(`Login - ${process.env.APP_NAME}`),
  loginChecker,
  getLogin
);

//post login routs
router.post(
  '/login',
  decorateResponse(`Login - ${process.env.APP_NAME}`),
  loginValidator(),
  loginValidatorResult,
  loginController
);

// get resters routes
router.get(
  '/register',
  decorateResponse(`Register - ${process.env.APP_NAME}`),
  loginChecker,
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

// email confirmation
router.get('/emailConfirmation/:id', emailConfirmation);

//logOut
router.get('/logout', logOut);

//password reset

//forgot password
router.get(
  '/resetPassword',
  decorateResponse(`Reset Password - ${process.env.APP_NAME}`),
  getResetPasswordPage
);
//post rout
router.post(
  '/resetPassword',
  decorateResponse(`Reset Password - ${process.env.APP_NAME}`),
  resetPassword
);

router.post(
  '/otpVerification',
  decorateResponse(`Verify OTP - ${process.env.APP_NAME}`),
  verifyOtp
);
router.post(
  '/createNewPassword',
  decorateResponse(`Create New - ${process.env.APP_NAME}`),
  newPasswordValidator,
  newPasswordValidationResult,
  createNewPassword
);

//module export
module.exports = router;
