const multer = require('multer');
const path = require('path');
const fs=require('fs')

var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    if (!fs.existsSync('src/uploads')) {
      fs.mkdirSync('src/uploads');
    }
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});
module.exports.upload = multer({
  storage: Storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});
