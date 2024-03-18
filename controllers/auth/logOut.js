const logOut = (req, res) => {
  res.clearCookie('access_token');

  res.redirect('/login');
};

module.exports = logOut;
