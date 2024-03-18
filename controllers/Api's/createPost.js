const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache } = require('../../utilitis/cacheManager');

const createPost = async (req, res, next) => {
  try {
    const postObj = {
      content: req.body.content,
      images: [],
      postedBy: req.id,
      likes: [],
      repost: [],
      postData: null,
    };
    [...req.files].forEach((file) => {
      postObj.images.push(file.filename);
    });
    const post = Post(postObj);
    const result = await post.save();

    await User.populate(result, {
      path: 'postedBy',
      select: '-password -email',
    });

    updateCache(`posts:${result._id}`, result);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = createPost;
