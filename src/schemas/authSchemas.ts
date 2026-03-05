import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(30),

  email: z
    .string()
    .email("Email inválido"),

  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
});

export const loginSchema = z.object({
  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(6)
});