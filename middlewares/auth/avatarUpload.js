//upload function

const upload = require('multer-uploader');
const path = require('path');
function avatarUpload(req, res, next) {
  const uploadDir = path.join(__dirname, '/../../public/uploads');
  const maxFileSize = 1000000;
  const allowedFileType = ['image/jpeg', 'image/jpg', 'image/png'];
  console.log('hello');
  upload(uploadDir, maxFileSize, allowedFileType).any()(req, res, (err) => {
    console.log(err);
    return;
    if (err) {
      const user = req.body;
      res.render('pages/register', {
        user,
        error,
      });
    } else {
      console.log(req.file);
      // next();
    }
  });
}

module.exports = avatarUpload;
