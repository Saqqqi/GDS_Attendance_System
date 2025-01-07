// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../Controllers/uploadController');

// Define the route for file upload
router.post('/upload', upload, uploadImage);

module.exports = router;
