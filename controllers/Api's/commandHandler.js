const Post = require('../../modles/Post');
const User = require('../../modles/User');
const { updateCache, getAndSetCache } = require('../../utilitis/cacheManager');

const commandHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const files = req.files;
    const content = req.body.content;

    const postData = {
      content,
      images: [],
      postedBy: userId,
      likes: [],
      repostUsers: [],
      postData: null,
      replayTo: postId,
      replayedPosts: [],
    };
    files.forEach((file) => {
      postData.images.push(file.filename);
    });
    const postObj = await Post(postData).save();
    const commandToPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { replayedPosts: postObj._id },
      },
      { new: true }
    );
    await updateCache(`posts:${postObj._id}`, postObj);
    await updateCache(`posts:${commandToPost._id}`, commandToPost);
    return res.json(postObj);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = commandHandler;
