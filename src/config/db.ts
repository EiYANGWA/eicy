import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  const user = encodeURIComponent(env.mongoUser);
  const pass = encodeURIComponent(env.mongoPass);

  const mongoUrl = `mongodb+srv://${user}:${pass}@${env.mongoHost}/${env.mongoDb}?retryWrites=true&w=majority`;

  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected");
}