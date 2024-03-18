//dependencies

const { response } = require('express');
const createHttpError = require('http-errors');
const User = require('../../modles/User');
const { getAndSetCache } = require('../../utilitis/cacheManager');

//functions

const singlePostHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.id;
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });

      return newUser;
    });
    const userJs = JSON.stringify(user);

    return res.render('pages/singlePost', {
      user: user ? user : {},
      userJs,
      postId,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, 'Internal Server Error!'));
  }
};

//exports

module.exports = singlePostHandler;
