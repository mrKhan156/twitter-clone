//dependencies

const createHttpError = require('http-errors');
const User = require('../../modles/User');

// email confirmation handler

const emailConfirmation = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          status: 'verified',
        },
      }
    );
    if (result) {
      res.render('pages/thankYou', { title: 'Thank you' });
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = emailConfirmation;
