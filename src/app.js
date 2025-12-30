require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/file.routes");
const app = express();
app.use(cors());
app.use(express.json());
/**
 * Health check route
 */
app.get("/", (req, res) => {
    res.status(200).send("File Upload API is running");
});
/**
 * Static file serving
 */
app.use("/uploads", express.static("uploads"));
/**
 * API routes
 */
app.use("/api/files", fileRoutes);
/**
 * Global error handler (LAST)
 */
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
