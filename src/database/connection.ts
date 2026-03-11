import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB(uri?: string) {
  try {

    const mongoURI = uri || env.MONGO_URI;

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB conectado");

  } catch (error) {

    console.error("❌ Erro ao conectar MongoDB");
    console.error(error);
    process.exit(1);

  }
}