//dependencies

const { response } = require('express');
const createHttpError = require('http-errors');
const User = require('../../modles/User');
const { getAndSetCache } = require('../../utilitis/cacheManager');

//functions

const getHomePage = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });

      return newUser;
    });
    const userJs = JSON.stringify(user);

    return res.render('pages/home/home', { user: user ? user : {}, userJs });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, 'Internal Server Error!'));
  }
};

//exports

module.exports = getHomePage;
