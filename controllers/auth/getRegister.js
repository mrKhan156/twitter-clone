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
module.exports = getRegister;
