//dependencies

const createHttpError = require('http-errors');
const User = require('../../modles/User');
const hashString = require('../../utilitis/hashString');
const sendEmail = require('../../utilitis/sendEmail');
const fs = require('fs');

// register controller
const register = async (req, res, next) => {
  try {
    if (Object.keys(req.error ? req.error : {}).length !== 0) {
      console.log(req.error);
      return res.render('pages/register', {
        user: req.body,
        error: req.error,
      });
    } else {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const username = req.body.username;
      const email = req.body.email;
      const password = await hashString(req.body.password);
      const profileAvatar = (req.file && req.file.filename) || '';

      const userObj = User({
        firstName,
        lastName,
        username,
        email,
        password,
        profileAvatar,
        status: 'unverified',
        likes: [],
        repostUser: [],
        postData: null,
        following: [],
        followers: [],
      });
      const user = await userObj.save();
      if (profileAvatar) {
        fs.renameSync(
          __dirname + `/../../temp/${profileAvatar}`,
          __dirname +
            `./../../public/uploads/${user._id}/profile/${profileAvatar}`
        );
      }

      if (user._id) {
        sendEmail(
          [user.email],
          {
            subject: 'Verify Your Account',
            template: ` <h3>Welcome To .....</h3> <br/> <br/>
            Click <a href="${process.env.APP_URL}/emailConfirmation/${user._id}"> here </a> to activate your account`,
            attachments: [],
          },
          (err, info) => {
            if (!err && info) {
              return res.render('pages/confirmation', {
                email: user.email,
                title: `Confirmation - ${process.env.APP_NAME}`,
              });
            }
          }
        );
      } else {
        next(createHttpError(500, 'Internal Server Error'));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
};
