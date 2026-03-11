import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  userId: string;
  email: string;
}

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

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return reply.status(401).send({
      message: "Formato do token inválido",
    });
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    return reply.status(401).send({
      message: "Token mal formatado",
    });
  }

  try {

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    request.user = decoded;

  } catch {

    return reply.status(401).send({
      message: "Token inválido",
    });

  }

}