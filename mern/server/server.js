import express from "express";
import dotenv from 'dotenv';
import {connectDB} from "./db/connection.js";
import cors from "cors";
import records from "./routes/record.js";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records); // Uncomment and adjust the path as necessary

const startServer = async () => {
  await connectDB(); // Ensure the database is connected before starting the server

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();