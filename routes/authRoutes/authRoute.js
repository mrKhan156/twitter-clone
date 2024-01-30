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
  register
);
module.exports = router;
