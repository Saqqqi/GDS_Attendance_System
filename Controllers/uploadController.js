// controllers/uploadController.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single('image');

const uploadImage = (req, res) => {
  if (req.file) {
    // Successfully uploaded the file
    res.json({ message: 'File uploaded successfully!', file: req.file });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

module.exports = { upload, uploadImage };
