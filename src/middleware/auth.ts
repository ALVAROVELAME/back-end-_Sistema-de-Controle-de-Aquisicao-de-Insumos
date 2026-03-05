import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      message: "Token não fornecido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, env.JWT_SECRET);

    request.user = decoded;

  } catch {

    return reply.status(401).send({
      message: "Token inválido",
    });

  }

}