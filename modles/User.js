const mongoose = require('mongoose');
const Post = require('./Post');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 1,
      trim: true,
    },
    username: {
      type: String,
      minLength: 1,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,

      required: true,
      unique: true,
      trim: true,
      validator: {
        validate: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
      },
    },

    password: {
      type: String,
      required: true,
      validator: {
        validate: function (v) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
      },
    },

    profileAvatar: {
      type: String,
    },
    profileCover: {
      type: String,
    },
    status: {
      type: String,
      enum: ['unverified', 'verified', 'suspended'],
      default: 'unverified',
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Post',
      },
    ],
    repost: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Post',
      },
    ],
    repost: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Post',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model('User', userSchema);

module.exports = User;
