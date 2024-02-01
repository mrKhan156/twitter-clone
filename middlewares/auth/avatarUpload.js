//upload function

const upload = require('multer-uploader');
const path = require('path');
function avatarUpload(req, res, next) {
  const uploadDir = path.join(__dirname, '/../../public/uploads');
  const maxFileSize = 10000000;
  const allowedFileType = ['image/jpeg', 'image/jpg', 'image/png'];

  upload(uploadDir, maxFileSize, allowedFileType).single('profileAvatar')(
    req,
    res,
    (err) => {
      if (err) {
        const user = req.body;
        const error = {
          profileAvatar: {
            msg: err?.message,
          },
        };

        req.error = error;
        next();
      } else {
        next();
      }
    }
  );
}

module.exports = avatarUpload;
