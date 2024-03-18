const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',
      },
    ],
    repostUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',
      },
    ],
    postData: {
      type: mongoose.Schema.Types.ObjectId,

      ref: 'Post',
    },
    replayTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    replayedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
);
//model
const Post = mongoose.model('Post', postSchema);

// exported

module.exports = Post;
