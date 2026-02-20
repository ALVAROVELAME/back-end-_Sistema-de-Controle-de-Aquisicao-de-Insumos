import { FastifyInstance } from "fastify";
import { register, login } from "../controllers/authController";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", { schema: { tags: ["Auth"] } }, register);
  app.post("/login", { schema: { tags: ["Auth"] } }, login);
}