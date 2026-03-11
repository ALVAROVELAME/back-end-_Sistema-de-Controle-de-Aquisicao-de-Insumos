import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive()
});

export type CreateItemInput = z.infer<typeof createItemSchema>;