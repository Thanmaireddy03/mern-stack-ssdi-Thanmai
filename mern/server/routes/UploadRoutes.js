import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Employee from '../db/Employee.js'; // Ensure correct path to the model

const router = express.Router();

// Configure multer to use memory storage and limit file size to 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Logging file details for debugging purposes
    console.log('File received on server:', req.file.originalname);
    console.log('File size:', req.file.size);

    // Parse the uploaded Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Use the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log('Parsed Excel data:', jsonData);

    // Validate data if necessary (you could implement custom validation here)
    if (jsonData.length === 0) {
      return res.status(400).send("Uploaded file is empty or not properly formatted.");
    }

    // Insert parsed data into MongoDB
    await Employee.insertMany(jsonData);
    console.log("data...", jsonData)
    res.status(200).send(`Data inserted successfully! (${jsonData.length} records)`);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send("Error inserting data: " + err.message);
  }
});

export default router;