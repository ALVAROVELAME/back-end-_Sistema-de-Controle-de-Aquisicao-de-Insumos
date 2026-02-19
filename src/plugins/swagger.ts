import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(import("@fastify/swagger"), {
    swagger: {
      info: {
        title: "API - Sistema de Controle de Insumos",
        description: "Documentação da API",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });
});
