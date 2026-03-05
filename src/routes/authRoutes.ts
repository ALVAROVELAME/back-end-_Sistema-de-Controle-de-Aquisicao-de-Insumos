import { FastifyInstance } from "fastify";
import { register, login, deleteAccount, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

export async function authRoutes(app: FastifyInstance) {

  // registro de usuário
  app.post("/register", register);

  // login
  app.post("/login", login);

  // verificação de email
  app.get("/verify/:token", verifyEmail);

  // deletar conta (rota protegida)
  app.delete(
    "/delete",
    {
      preHandler: authMiddleware
    },
    deleteAccount
  );

}