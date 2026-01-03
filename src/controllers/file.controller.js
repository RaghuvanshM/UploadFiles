const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
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
exports.getAllFiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files ORDER BY created_at DESC')
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getFileById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json({ data: result.rows[0] });
    } catch (error) {
        console.log('Error fetching file by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}
exports.downloadFile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM files where id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "File not found" });
        }
        console.log("Downloading file:", result.rows[0]);
        const file = result.rows[0];
        const filePath = path.resolve(file.file_path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File missing on server" });
        }
        res.send(filePath, file.original_name);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
exports.deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("select * from files where id =$1", [id]);
        if (result.rows.length == 0) {
            return res.status(404).json({ message: "File not found" });
        }
        const file = result.rows[0];
        const filePath = path.resolve(file.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await pool.query("delete from files where id =$1", [id]);
        res.status(200).json({ message: "file deleted successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}