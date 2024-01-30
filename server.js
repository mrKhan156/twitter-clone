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
app.use(cookieParser());

//routing
app.use(authRoute);

//  not found handler
app.use(notFoundHandler);
// error handler middleware
app.use(errorHandler);

//listing middleware
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log('server listening on port ' + (process.env.PORT || 3000));
    });
  })
  .catch((err) => {
    console.log(err);
  });
