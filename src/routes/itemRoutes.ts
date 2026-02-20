import { FastifyInstance } from "fastify";
import * as controller from "../controllers/itemController";
import { authMiddleware } from "../middleware/auth";

export async function itemRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/items", { schema: { tags: ["Items"] } }, controller.create);
  app.get("/items", { schema: { tags: ["Items"] } }, controller.list);
  app.patch("/items/:id/toggle", { schema: { tags: ["Items"] } }, controller.toggle);
  app.delete("/items/:id", { schema: { tags: ["Items"] } }, controller.remove);
}