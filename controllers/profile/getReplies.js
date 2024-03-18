//dependencies

const { response } = require('express');
const createHttpError = require('http-errors');
const User = require('../../modles/User');
const { getAndSetCache } = require('../../utilitis/cacheManager');

//functions

const getReplies = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });

      return newUser;
    });
    const userProfile = await User.findOne({ username: req.params.username });
    const userJs = JSON.stringify(user);
    const profileUserJs = JSON.stringify(userProfile);

    return res.render('pages/profile/profile', {
      user: user ? user : {},
      userJs,
      userProfile,
      profileUserJs,
      tab: 'replies',
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, 'Internal Server Errorrrr!'));
  }
};

//exports

module.exports = getReplies;
