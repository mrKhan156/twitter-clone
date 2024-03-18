const jwt = require('jsonwebtoken');

const loginChecker = async (req, res, next) => {
  try {
    if (req?.signedCookies?.access_token) {
      const token = req.signedCookies.access_token.split(' ')[1];

      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      req.email = decode.email;
      req.username = decode.username;
      req.id = decode._id;

      if (req.originalUrl === '/login' || req.originalUrl === '/register') {
        return res.redirect('/');
      }
      next();
    } else {
      if (req.originalUrl === '/register')
        return res.render('pages/register', { error: {}, user: {} });
      res.render('pages/login', { error: {}, user: {} });
    }
  } catch (error) {
    if (error.message === 'jwt expired') {
      if (req.originalUrl === '/register')
        return res.render('pages/register', { error: {}, user: {} });

      res.render('pages/login', { error: {}, user: {} });
    }
    next(error);
  }
};

module.exports = loginChecker;
