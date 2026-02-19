import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";


app.register(authRoutes);


dotenv.config();

const app = Fastify({ logger: true });

// Plugins
app.register(cors);

app.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});

app.register(swagger, {
  swagger: {
    info: {
      title: "Shopping API",
      description: "API de controle de aquisições",
      version: "1.0.0",
    },
  },
});

app.register(swaggerUI, {
  routePrefix: "/docs",
});

// Rotas base
app.get("/health", async () => {
  return { status: "ok" };
});

// Server start
const start = async () => {
  try {
    await app.listen({ 
      port: Number(process.env.PORT), 
      host: "0.0.0.0" 
    });
    console.log("🚀 Server running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
