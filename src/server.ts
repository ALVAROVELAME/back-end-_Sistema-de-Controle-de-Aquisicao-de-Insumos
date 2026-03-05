import Fastify from "fastify";
import { connectDB } from "./database/connection";
import jwt from "./plugins/jwt";
import swagger from "./plugins/swagger";
import { authRoutes } from "./routes/authRoutes";
import { itemRoutes } from "./routes/itemRoutes";
import { env } from "./config/env";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";

const app = Fastify({ logger: true });

async function start() {
  try {
    await connectDB();

    app.register(jwt);
    app.register(swagger);
    app.register(helmet);
    app.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute"
    });

    // ✅ Prefixos adicionados
    app.register(authRoutes, { prefix: "/auth" });
    app.register(itemRoutes, { prefix: "/items" });

    await app.listen({ 
      port: env.PORT,
      host: "0.0.0.0" // importante para Docker depois 👌
    });

    console.log("🚀 Server running");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();