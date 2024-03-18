//dependencies

const Otp = require('../../modles/Otp');
const User = require('../../modles/User');
const sendEmail = require('../../utilitis/sendEmail');

require('dotenv').config();
const resetPassword = async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await User.findOne(
      {
        $or: [
          {
            email: username,
          },
          {
            username: username,
          },
        ],
      },
      { email: 1 }
    );
    if (user) {
      const otpObj = new Otp({
        Otp: Math.floor(1000 + Math.random() * 9000),
        email: user.email,
        expireIn: Date.now() + 120010,
      });
      const otp = await otpObj.save();

      await sendEmail(
        [user.email],
        {
          subject: 'Reset Your password',
          template: `Your OTP is : ${otp.Otp}`,
          attachments: [],
        },
        function (err, info) {
          if (info?.messageId) {
            res.render('pages/verifyOtp', {
              error: {},
              otp: {
                value: null,
                otpId: otp._id,
                email: user.email,
              },
            });
          } else {
            throw err;
          }
        }
      );
    } else {
      res.render('pages/resetPassword', {
        error: {
          username: {
            msg: 'User not Found!',
          },
        },
        user: {
          username,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = resetPassword;
