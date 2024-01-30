//dependencies
const createError = require('http-errors');
//not Found handlers
function notFoundHandler(req, res, next) {
  next(createError(404, 'Not Found'));
}

// error handlers middleware
function errorHandler(err, req, res, next) {
  const error =
    process.env.NODE_ENV === 'development' ? err : { message: err.message };

  if (res.headersSent) {
    next(error);
  } else {
    try {
      res.locals.error = error;
      res.status(error.status || 500);
      if (res.locals.html) {
        res.render('pages/error', {
          title: 'Error Page',
        });
      } else {
        res.json(error);
      }
    } catch (error) {
      next(error);
    }
  }
}

//exports
module.exports = {
  notFoundHandler,
  errorHandler,
};
