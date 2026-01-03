const express = require('express');
const upload = require('../middleware/upload');
const { uploadFile, getAllFiles, getFileById, downloadFile, deleteFile } = require('../controllers/file.controller');
const router = express.Router();
router.post('/upload', upload.single('file'), uploadFile);
router.get("/listFile", getAllFiles)
router.get("/files/:id", getFileById)
router.get("/files/download/:id", downloadFile)
router.delete("/files/:id", deleteFile)
module.exports = router;
