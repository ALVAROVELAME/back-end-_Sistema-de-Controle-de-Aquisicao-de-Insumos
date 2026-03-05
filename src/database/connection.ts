import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("✅ MongoDB conectado");

  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB");
    console.error(error);
    process.exit(1);
  }
}