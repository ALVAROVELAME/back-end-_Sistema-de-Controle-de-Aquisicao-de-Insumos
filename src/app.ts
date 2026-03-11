import Fastify from "fastify";
import { connectDB } from "./database/connection";
import jwt from "./plugins/jwt";
import swagger from "./plugins/swagger";
import { authRoutes } from "./routes/authRoutes";
import { itemRoutes } from "./routes/itemRoutes";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { ZodError } from "zod";

export async function buildApp(dbUri?: string) {

  const app = Fastify({ logger: false });

  await connectDB(dbUri);

  app.register(jwt);

  // handler global de erro
  app.setErrorHandler((error, request, reply) => {

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Dados inválidos",
        details: error.errors
      });
    }

    console.error(error);

    return reply.status(500).send({
      error: "Erro interno do servidor"
    });

  });

  // plugins pesados apenas fora de testes
  if (process.env.NODE_ENV !== "test") {

    app.register(swagger);

    app.register(helmet);

    app.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute"
    });

  }

  // rota simples para testes
  app.get("/", async () => {
    return { message: "API funcionando 🚀" };
  });

  app.register(authRoutes, { prefix: "/auth" });
  app.register(itemRoutes, { prefix: "/items" });

  return app;

}