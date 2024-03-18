// dependencies

// forget password page handler

const getResetPasswordPage = (req, res, next) => {
  try {
    res.render('pages/reset-password', {
      error: {},
      user: {},
    });
  } catch (error) {
    console.log(error);
  }
};

//export
module.exports = getResetPasswordPage;
