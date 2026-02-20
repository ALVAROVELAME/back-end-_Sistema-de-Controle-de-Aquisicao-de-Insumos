import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/authService";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { username, email, password } = request.body as {
      username: string;
      email: string;
      password: string;
    };

    const result = await authService.register(username, email, password);

    return reply.status(201).send(result);

  } catch (error: any) {
    return reply.status(error.statusCode || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const result = await authService.login(email, password);

    // ✅ IMPORTANTE → await
    const token = await reply.jwtSign(
      { id: result.user.id, email: result.user.email },
      { expiresIn: "1d" }
    );

    return reply.send({
      ...result,
      token,
    });

  } catch (error: any) {
    return reply.status(error.statusCode || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
}