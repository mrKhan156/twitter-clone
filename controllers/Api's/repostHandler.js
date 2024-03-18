const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { getAndSetCache, updateCache } = require('../../utilitis/cacheManager');

const repostHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const deletePost = await Post.findOneAndDelete({
      postedBy: userId,
      postData: postId,
    });

    let = rePostObj = deletePost;
    if (rePostObj === null) {
      const post = Post({
        postedBy: userId,
        postData: postId,
      });
      rePostObj = await post.save();
      updateCache(`posts:${rePostObj._id}`, rePostObj);
    }

    //post like

    const option = deletePost !== null ? '$pull' : '$addToSet';

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        [option]: { repostUsers: userId },
      },
      { new: true }
    );

    updateCache(`posts:${postId}`, post);

    //user like array
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        [option]: { repost: postId },
      },
      { new: true }
    );
    updateCache(`users:${userId}`, modifiedUser);
    return res.json(post);

    //update user like
  } catch (error) {
    next(error);
  }
};

module.exports = repostHandler;
