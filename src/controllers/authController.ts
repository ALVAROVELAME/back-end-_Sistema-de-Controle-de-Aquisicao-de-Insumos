import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body as any;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return reply.status(400).send({ error: "Usuário já existe" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return reply.status(201).send(user);
};

export const login = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password } = request.body as any;

  const user = await User.findOne({ email });

  if (!user) {
    return reply.status(400).send({ error: "Credenciais inválidas" });
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    return reply.status(400).send({ error: "Credenciais inválidas" });
  }

  const token = await reply.jwtSign(
    { id: user._id, email: user.email },
    { expiresIn: "1d" }
  );

  return reply.send({ token });
};
