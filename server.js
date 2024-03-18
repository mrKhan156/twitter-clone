//dependencies

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/common/errorHandelers');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoutes/authRoute.js');
const mongoose = require('mongoose');
const homeRouter = require('./routes/home/homeRout.js');
const postRoutes = require("./routes/Api's/postRoute.js");
const { redisClient } = require('./utilitis/cacheManager.js');
const profileRouter = require('./routes/profile/profileRoute.js');

// app initialization
const app = express();
dotenv.config();

//express settings
app.set('view engine', 'pug');
app.set('views', 'views');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing
app.use(authRoute);

//homerout
app.use('/', homeRouter);
app.use('/posts', postRoutes);
app.use('/profile', profileRouter);

//  not found handler
app.use(notFoundHandler);
// error handler middleware
app.use(errorHandler);

//listing middleware
async function social() {
  try {
    await redisClient.connect();
    await mongoose.connect(process.env.DB_URL, {});
    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT || 3000, () => {
  social();
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
