import { FastifyRequest, FastifyReply } from "fastify";
import { createItemSchema } from "../schemas/itemSchemas";
import { createItem, getItemsByUser, updateItem, deleteItem } from "../services/itemService";

export async function createItemController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const body = createItemSchema.parse(request.body);

  const userId = (request.user as any).userId;

  const item = await createItem({
    ...body,
    userId
  });

  return reply.status(201).send(item);
}

export async function getItemsController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const userId = (request.user as any).userId;

  const items = await getItemsByUser(userId);

  return reply.send(items);

}

export async function updateItemController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  console.log("✏️ Controller updateItem");

  const { id } = request.params as any;

  console.log("📌 ID recebido:", id);

  const data = request.body;

  console.log("📌 Body recebido:", data);

  const item = await updateItem(id, data);

  return reply.send(item);

}

export async function deleteItemController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  console.log("🗑️ Controller deleteItem");

  const { id } = request.params as any;

  console.log("📌 ID recebido:", id);

  const item = await deleteItem(id);

  return reply.send({
    message: "Item deletado com sucesso",
    item
  });

}