const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache, getAndSetCache } = require('../../utilitis/cacheManager');

const updateCover = async (req, res, next) => {
  try {
    const fileName = req?.files[0].filename;
    console.log(req.files);
    const user = await User.findByIdAndUpdate(
      req.id,
      {
        profileCover: fileName,
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

module.exports = updateCover;
