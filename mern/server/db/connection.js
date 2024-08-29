import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.ATLAS_URI || "";
const client = new MongoClient(URI, {
  tls: true, // Ensure TLS is enabled
});

let db;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    db = client.db("employees");
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected!");
  }
  return db;
};

export { connectDB, getDB };
