// dependencies
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const Otp = require('../../modles/Otp');

require('dotenv').config();

// otp handler

const verifyOtp = async (req, res) => {
  try {
    const otpInput = req.body?.otp;
    const otpId = req.body?.otpId;

    const otpObj = await Otp.findOne({ _id: otpId });
    if (
      Number(otpInput) === otpObj.Otp &&
      otpObj?.expireIn.getTime() > Date.now()
    ) {
      const result = await Otp.findByIdAndUpdate(
        { _id: otpObj._id },
        {
          $set: {
            status: true,
          },
        }
      );
      if (result) {
        res.render('pages/createNewPassword', {
          error: {},
          user: {},
          otp: {
            otpId: result._id,
            otp: result.Otp,
          },
        });
      } else {
        throw createHttpError(500, 'Internal Server Error!');
      }
    } else {
      const errMsg =
        otpObj?.expireIn.getTime() > Date.now() ? 'Invalid Otp' : 'Expired Otp';
      res.render('pages/verifyOtp', {
        error: {
          otp: { msg: errMsg },
        },
        otp: {
          value: otpInput,
          otpId: otpId,
          email: otpObj.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.render('pages/verifyOtp', {
      error: {
        otp: { msg: 'Invalid otp' },
      },
      otp: {
        value: otpInput,
        token: otpId,
        email: otpObj.email,
      },
    });
  }
};

module.exports = verifyOtp;
