const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache, getAndSetCache } = require('../../utilitis/cacheManager');

const followHandler = async (req, res, next) => {
  try {
    const followingUserId = req.params.id;
    const loggedInUser = req.id;

    const user = await getAndSetCache(`users:${loggedInUser}`, async () => {
      const newData = User.findOne({ _id: loggedInUser });
      return newData;
    });
    const isFollowing =
      user.following && user.following.includes(followingUserId);

    const option = isFollowing ? '$pull' : '$addToSet';
    //update user likes
    const modifiedLoggedInUser = await User.findOneAndUpdate(
      { _id: loggedInUser },
      {
        [option]: { following: followingUserId },
      },
      { new: true }
    );
    updateCache(`users:${loggedInUser}`, modifiedLoggedInUser);

    // update users followers
    const modifiedFollowingUser = await User.findOneAndUpdate(
      { _id: followingUserId },
      {
        [option]: { followers: loggedInUser },
      },
      { new: true }
    );
    updateCache(`users:${followingUserId}`, modifiedFollowingUser);

    res.json(modifiedFollowingUser);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = followHandler;
