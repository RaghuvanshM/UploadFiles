const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, filename, mimetype, size, path } = req.file;
    try {
        const result = await pool.query(
            `INSERT INTO files (id, original_name, stored_name, mime_type, file_size, file_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [uuidv4(), originalname, filename, mimetype, size, path]);
        res.status(201).json({ message: 'File uploaded successfully', file: result.rows[0] });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}