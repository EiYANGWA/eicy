import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    const user = encodeURIComponent(env.mongoUser);
    const pass = encodeURIComponent(env.mongoPass);
    const mongoUrl = `mongodb+srv://${user}:${pass}@${env.mongoHost}/${env.mongoDb}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoUrl);
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // ปิดตัวลงทันทีถ้าเชื่อมต่อไม่ได้
  }
}