const getHomePage = require('../../controllers/home/homeController');
const decorateResponse = require('../../middlewares/common/decorateResponse');
const loginChecker = require('../../middlewares/common/loginChecker');

//dependencies
const homeRouter = require('express').Router();
require('dotenv').config();

//get home page
homeRouter.get(
  '/',
  decorateResponse(`Home Page - ${process.env.APP_URL}`),
  loginChecker,
  getHomePage
);

// exports

module.exports = homeRouter;
