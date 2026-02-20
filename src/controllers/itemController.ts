import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "../services/itemService";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as any;

  const item = await service.createItem({
    ...(request.body as any),
    userId: user.id,
  });

  reply.send(item);
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as any;

  const items = await service.listItems(user.id);

  reply.send(items);
}

export async function toggle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;

  const item = await service.toggleItem(id);

  reply.send(item);
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;

  await service.deleteItem(id);

  reply.code(204).send();
}