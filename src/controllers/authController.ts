import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/authService";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { User } from "../models/User";

export async function register(request: FastifyRequest, reply: FastifyReply) {

  try {

    const data = registerSchema.parse(request.body);

    const result = await authService.register(
      data.username,
      data.email,
      data.password
    );

    return reply.send(result);

  } catch (error: any) {

    return reply.status(error.statusCode || 400).send({
      message: error.message
    });

  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {

  try {

    const data = loginSchema.parse(request.body);

    const result = await authService.login(
      data.email,
      data.password
    );

    return reply.send(result);

  } catch (error: any) {

    return reply.status(error.statusCode || 400).send({
      message: error.message
    });

  }
}

export async function verifyEmail(request: FastifyRequest, reply: FastifyReply) {
  const { token } = request.params as any;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    // Se frontend não existir, retorna JSON
    return reply.status(404).send({
      message: "Token inválido ou usuário não encontrado",
      success: false
    });
  }

  // Marca usuário como verificado
  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();

  // Se frontend existir, redireciona
  const frontendUrl = process.env.FRONTEND_URL || "";

  if (frontendUrl) {
    return reply.redirect(`${frontendUrl}/email-confirmed`);
  }

  // Fallback: envia JSON
  return reply.send({
    message: "Email confirmado com sucesso",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    success: true
  });
}

export async function deleteAccount(request: FastifyRequest, reply: FastifyReply) {

  try {

    const userId = (request as any).user.userId;

    const result = await authService.deleteAccount(userId);

    return reply.send(result);

  } catch (error: any) {

    return reply.status(error.statusCode || 400).send({
      message: error.message
    });

  }
}