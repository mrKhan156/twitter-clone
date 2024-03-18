const followHandler = require("../../controllers/Api's/followHandler");
const updateAvatar = require("../../controllers/Api's/uploadAvatar");
const updateCover = require("../../controllers/Api's/uploadCover");
const getFollowers = require('../../controllers/follow/getFollowers');
const getFollowing = require('../../controllers/follow/getfollowing');
const getPost = require('../../controllers/profile/getPosts');
const getReplies = require('../../controllers/profile/getReplies');
const uploadAvatarImage = require("../../middlewares/Api's/uploadAvatarImage");
const uploadCoverImage = require("../../middlewares/Api's/uploadCoverImage");
const decorateResponse = require('../../middlewares/common/decorateResponse');
const loginChecker = require('../../middlewares/common/loginChecker');

//dependencies
const profileRouter = require('express').Router();
require('dotenv').config();

//get post page
profileRouter.get(
  '/:username',
  decorateResponse(`Profile Page - ${process.env.APP_URL}`),
  loginChecker,
  getPost
);
//get Replies page
profileRouter.get(
  '/:username/replies',
  decorateResponse(`Home Page - ${process.env.APP_URL}`),
  loginChecker,
  getReplies
);
//get home page
profileRouter.put('/:id/follow', loginChecker, followHandler);
profileRouter.post('/avatar', loginChecker, uploadAvatarImage, updateAvatar);
profileRouter.post('/cover', loginChecker, uploadCoverImage, updateCover);
//get home page
profileRouter.get(
  '/:username/followers',
  decorateResponse(`Profile Page - ${process.env.APP_URL}`),
  loginChecker,
  getFollowers
);
//get home page
profileRouter.get(
  '/:username/following',
  decorateResponse(`Profile Page - ${process.env.APP_URL}`),
  loginChecker,
  getFollowing
);

// exports

module.exports = profileRouter;
