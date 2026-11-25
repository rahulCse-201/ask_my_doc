import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");

  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  }catch(err){
    console.log("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}
