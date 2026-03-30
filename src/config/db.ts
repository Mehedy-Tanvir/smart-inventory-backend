import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "smart_inventory";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName,
    });
    console.log(`MongoDB connected to database: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
