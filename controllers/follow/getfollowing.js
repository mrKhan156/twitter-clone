const createHttpError = require('http-errors');
const User = require('../../modles/User');
const { getAndSetCache } = require('../../utilitis/cacheManager');

const getFollowers = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });

      return newUser;
    });
    const userProfile = await User.findOne({ username: username });
    await User.populate(userProfile, { path: 'following' });
    await User.populate(userProfile, { path: 'followers' });

    const userJs = JSON.stringify(user);
    const profileUserJs = JSON.stringify(userProfile);
    return res.render('pages/follow/follow', {
      user: user ? user : {},
      userJs,
      userProfile,
      profileUserJs,
      tab: 'following',
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, 'Internal Server Error'));
  }
};
module.exports = getFollowers;
