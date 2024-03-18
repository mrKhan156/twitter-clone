const Otp = require('../../modles/Otp');
const jwt = require('jsonwebtoken');
const User = require('../../modles/User');
const hashString = require('../../utilitis/hashString');
const createHttpError = require('http-errors');
require('dotenv').config();

//function
const createNewPassword = async (req, res, next) => {
  try {
    console.log('hello1');
    const otpId = req.body.otpId;
    const otp = req.body.otp;
    const password = req.password;

    const otpObj = await Otp.findOne({ _id: otpId });
    if (Number(otp) === otpObj.Otp && otpObj.status) {
      const hashedPassword = await hashString(password);
      const result = await User.findOneAndUpdate(
        {
          email: otpObj.email,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      if (result) {
        const token = await jwt.sign(
          {
            username: result.username,
            email: result.email,
            _id: result._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        res.status(200);
        res.cookie('access_token', 'Bearer ' + token, { signed: true });
        res.redirect('/');
      } else {
        throw createHttpError(500, 'Internal Server Error');
      }
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = createNewPassword;
