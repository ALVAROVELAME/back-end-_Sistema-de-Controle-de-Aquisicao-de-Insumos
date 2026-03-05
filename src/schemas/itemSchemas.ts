import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Nome � obrigat�rio"),
  quantity: z.number().min(1, "Quantidade deve ser no m�nimo 1"),
  price: z.number().min(0, "Pre�o n�o pode ser negativo"),
});

export const updateItemSchema = z.object({
  name: z.string().optional(),
  quantity: z.number().min(1).optional(),
  price: z.number().min(0).optional(),
});
