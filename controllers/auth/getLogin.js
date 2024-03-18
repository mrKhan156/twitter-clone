// get login page
const getLogin = (req, res, next) => {
  try {
    res.render('pages/login', {
      error: {},
      user: {},
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getLogin;
