const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { getAndSetCache } = require('../../utilitis/cacheManager');

// creating post
const singlePostController = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const result = await getAndSetCache(`posts:${postId}`, async () => {
      const newData = await Post.findById(postId);

      await User.populate(newData, { path: 'postedBy' });
      await Post.populate(newData, { path: 'replayTo' });
      await Post.populate(newData, { path: 'replayedPosts' });
      await Post.populate(newData, { path: 'replayedPosts.replayTo' });
      await Post.populate(newData, { path: 'replayedPosts.replayTo.postedBy' });
      await User.populate(newData, { path: 'replayedPosts.postedBy' });
      await Post.populate(newData, { path: 'replayTo.postedBy' });
      return newData;
    });

    return res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = singlePostController;
