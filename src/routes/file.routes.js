const express = require('express');
const upload = require('../middleware/upload');
const { uploadFile } = require('../controllers/file.controller');
const router = express.Router();
router.post('/upload', upload.single('file'), uploadFile);
module.exports = router;
