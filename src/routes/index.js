const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');
const captureController = require('../controllers/captureController');
const analysisController = require('../controllers/analysisController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

router.post('/upload', upload.single('image'), uploadController.uploadImage);
router.post('/capture', captureController.captureImage);
router.post('/analyze/:filename', analysisController.analyzeImage);

module.exports = router;