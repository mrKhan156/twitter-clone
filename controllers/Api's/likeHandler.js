const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { getAndSetCache, updateCache } = require('../../utilitis/cacheManager');

const likeHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    // update post like
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = await User.findOne({ _id: req.id });
      console.log(newData);
      return newData;
    });

    //post like

    const isLiked = user.likes && user.likes.includes(postId);

    const option = isLiked ? '$pull' : '$addToSet';

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        [option]: { likes: userId },
      },
      { new: true }
    );

    await User.populate(post, { path: 'postedBy' });
    await Post.populate(post, { path: 'replayTo' });
    await Post.populate(post, { path: 'replayedPosts' });
    await Post.populate(post, { path: 'replayedPosts.replayTo' });
    await Post.populate(post, { path: 'replayedPosts.replayTo.postedBy' });
    await User.populate(post, { path: 'replayedPosts.postedBy' });
    await Post.populate(post, { path: 'replayTo.postedBy' });
    updateCache(`posts:${postId}`, post);

    //user like array
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        [option]: { likes: postId },
      },
      { new: true }
    );
    updateCache(`users:${userId}`, modifiedUser);
    res.json(post);

    //update user like
  } catch (error) {
    next(error);
  }
};

module.exports = likeHandler;
