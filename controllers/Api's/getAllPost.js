const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache, getAndSetCache } = require('../../utilitis/cacheManager');

// creating post
const getAllPosts = async (req, res, next) => {
  try {
    const filterObj = {};
    req.query.postedBy && (filterObj.postedBy = req.query?.postedBy);
    req.query.replayTo &&
      (filterObj.replayTo =
        req.query?.replayTo === 'false'
          ? { $exists: false }
          : { $exists: true });

    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = User.findOne({ _id: req.id });
      return newData;
    });

    user.following = user.following || [];

    const followingUsers = [...user.following];
    followingUsers.push(user._id);

    req.query.followingOnly &&
      req.query.followingOnly === true &&
      (filterObj.postedBy = { $in: followingUsers });

    const result = await Post.find(filterObj);

    await User.populate(result, {
      path: 'postedBy',
      select: '-password -email',
    });
    await Post.populate(result, {
      path: 'postData',
      select: '-password -email',
    });
    await User.populate(result, {
      path: 'postData.postedBy',
    });
    await Post.populate(result, {
      path: 'replayTo',
    });
    await User.populate(result, {
      path: 'replayTo.postedBy',
    });

    return res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = getAllPosts;
