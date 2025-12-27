const express = require("express")
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg and .png files are allowed!'), false);
    }
}
const upload = multer({
    storage, fileFilter, limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
    },
});
app.post("/upload", (req, res) => {
    upload.single('file')(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        res.status(200).json({ message: "File uploaded successfully", filePath: req?.file?.path });
    })
})
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});