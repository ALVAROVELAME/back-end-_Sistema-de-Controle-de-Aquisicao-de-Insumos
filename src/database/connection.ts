import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB", error);
    process.exit(1);
  }
}