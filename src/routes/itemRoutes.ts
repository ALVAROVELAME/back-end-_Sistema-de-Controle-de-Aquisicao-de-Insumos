import { FastifyInstance } from "fastify";
import { createItemController, getItemsController, updateItemController, deleteItemController } from "../controllers/itemController";
import { authMiddleware } from "../middleware/auth";

export async function itemRoutes(app: FastifyInstance) {

  app.post(
    "/",
    { preHandler: authMiddleware },
    createItemController
  );

  app.get(
    "/",
    { preHandler: authMiddleware },
    getItemsController
  );

  app.patch(
    "/:id",
    { preHandler: authMiddleware },
    updateItemController
  );

  app.delete(
    "/:id",
    { preHandler: authMiddleware },
    deleteItemController
  );

}