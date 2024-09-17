import { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Preview the first 10 rows
      setPreviewData(jsonData.slice(0, 10));
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || previewData.length === 0) {
      alert("Please upload a valid Excel file!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Confirm data submission
      const response = await axios.post('http://localhost:5050/api/upload', formData);
      if (response.status === 200) {
        alert('Data inserted successfully!');
      } else {
        alert('Error inserting data');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while uploading the file');
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      {previewData.length > 0 && (
        <div>
          <h3>Preview First 10 Rows</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleConfirm}>Confirm and Insert</button>
        </div>
      )}
      {confirmed && (
        <button onClick={handleSubmit}>Upload and Save Records</button>
      )}
    </div>
  );
};

export default FileUpload;