const commandHandler = require("../../controllers/Api's/commandHandler");
const createPost = require("../../controllers/Api's/createPost");
const deletedPost = require("../../controllers/Api's/deletePost");
const getAllPosts = require("../../controllers/Api's/getAllPost");
const likeHandler = require("../../controllers/Api's/likeHandler");
const repostHandler = require("../../controllers/Api's/repostHandler");
const singlePostController = require("../../controllers/Api's/singlePostController");
const singlePostHandler = require('../../controllers/singlePost/singlePost');
const uploadPostImage = require("../../middlewares/Api's/uploadPostImage");
const decorateResponse = require('../../middlewares/common/decorateResponse');
const loginChecker = require('../../middlewares/common/loginChecker');

const postRoutes = require('express').Router();
require('dotenv').config();
//get home page

postRoutes.post('/', loginChecker, uploadPostImage, createPost);
postRoutes.get('/:postId', loginChecker, singlePostHandler);
postRoutes.delete('/:postId', loginChecker, deletedPost);
postRoutes.get('/single/:postId', loginChecker, singlePostController);

postRoutes.get('/', loginChecker, getAllPosts);

// poost like routes
postRoutes.put('/like/:id', loginChecker, likeHandler);
postRoutes.post('/repost/:id', loginChecker, repostHandler);
postRoutes.post('/replay/:id', loginChecker, uploadPostImage, commandHandler);

module.exports = postRoutes;
