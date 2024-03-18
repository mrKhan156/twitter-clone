const { response } = require('express');
const Post = require('../../modles/Post');
const User = require('../../modles/User');
const {
  getAndSetCache,
  updateCache,
  deleteCatch,
} = require('../../utilitis/cacheManager');
const createHttpError = require('http-errors');

const deletedPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.id;

    //delete the post

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      postedBy: userId,
    });

    if (deletedPost !== null) {
      await deleteCatch(`posts:${deletedPost._id}`);
    } else {
      return next(createHttpError(400, 'Not Found'));
    }
    //remove the post id replayed posts from the main pposts
    if (deletedPost?.replayTo) {
      const replayToPost = await Post.findOneAndUpdate(
        deletedPost.replayTo,
        {
          $pull: { replayedPosts: postId },
        },
        { new: true }
      );
      if (replayToPost !== null) {
        await User.populate(replayToPost, { path: 'postedBy' });
        await Post.populate(replayToPost, { path: 'replayTo' });
        await Post.populate(replayToPost, { path: 'replayedPosts' });
        await Post.populate(replayToPost, { path: 'replayedPosts.replayTo' });
        await Post.populate(replayToPost, {
          path: 'replayedPosts.replayTo.postedBy',
        });
        await User.populate(replayToPost, { path: 'replayedPosts.postedBy' });
        await Post.populate(replayToPost, { path: 'replayTo.postedBy' });

        await updateCache(`posts:${replayToPost?._id}`, replayToPost);
      }
    }
    // delete this id from reposted user array

    if (deletedPost?.postData) {
      const repostedPost = await Post.findOneAndUpdate(
        deletedPost?.postData,
        {
          $pull: { repostUsers: userId },
        },
        {
          new: true,
        }
      );
      await User.populate(repostedPost, { path: 'postedBy' });
      await Post.populate(repostedPost, { path: 'replayTo' });
      await Post.populate(repostedPost, { path: 'replayedPosts' });
      await Post.populate(repostedPost, { path: 'replayedPosts.replayTo' });
      await Post.populate(repostedPost, {
        path: 'replayedPosts.replayTo.postedBy',
      });
      await User.populate(repostedPost, { path: 'replayedPosts.postedBy' });
      await Post.populate(repostedPost, { path: 'replayTo.postedBy' });

      await updateCache(`posts:${repostedPost._id}`, repostedPost);
    }
    // delete post id from the reposts users

    if (deletedPost?.repostUsers?.length) {
      deletedPost?.repostUsers?.forEach(async (uId) => {
        const user = await User.findByIdAndUpdate(
          uId,
          {
            $pull: {
              repost: deletedPost._id,
            },
          },
          { new: true }
        );
      });
    }
    console.log(deletedPost?.repostUsers);

    //delete all reposted posts
    if (deletedPost?.repostUsers?.length) {
      console.log('delete all reposted posts');
      deletedPost?.repostUsers?.forEach(async (uId) => {
        const deletedRepostedPost = await Post.findOneAndDelete({
          postData: deletedPost._id,
          postedBy: uId,
        });
        await deleteCatch(`posts:${deletedRepostedPost._id}`);
      });
    }
    // remove like array
    if (deletedPost?.likes?.length) {
      deletedPost?.likes?.forEach(async (userId) => {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              likes: deletedPost._id,
            },
          },
          { new: true }
        );
        await updateCache(`users:${user._id}`, user);
      });
    }

    return res.json(deletedPost);
  } catch (err) {
    console.log(err);
  }
};
module.exports = deletedPost;
