//dependencies

// get login page
const getLogin = (req, res, next) => {
  try {
    res.render('pages/login');
  } catch (error) {
    next(error);
  }
};

// get regiater page

const getRegister = (req, res, next) => {
  try {
    res.render('pages/register', {
      error: {},
      user: {},
    });
  } catch (error) {
    next(error);
  }
};
// register controller
const register = (req, res, next) => {
  if (Object.keys(req.error).length !== 0) {
    console.log(req.error);
    return res.render('pages/register', {
      user: req.body,
      error: req.error,
    });
  } else {
    console.log(req.body);
  }
};

module.exports = {
  getLogin,
  getRegister,
  register,
};
