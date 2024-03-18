const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache, getAndSetCache } = require('../../utilitis/cacheManager');

const updateAvatar = async (req, res, next) => {
  try {
    const fileName = req?.files[0].filename;

    const user = await User.findByIdAndUpdate(
      req.id,
      {
        profileAvatar: fileName,
      },
      {
        new: true,
      }
    );
    await updateCache(`users:${user._id}`, user);
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateAvatar;
