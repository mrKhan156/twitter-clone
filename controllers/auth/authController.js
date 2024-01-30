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
    res.render('pages/register');
  } catch (error) {
    next(error);
  }
};
// register controller
const register = (req, res, next) => {
  console.log(req.file);
  console.log(req.files);

  console.log(req.body);
};

module.exports = {
  getLogin,
  getRegister,
  register,
};
