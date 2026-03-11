import { Item } from "../models/Item";
import { CreateItemInput } from "../schemas/itemSchemas";

interface CreateItemParams extends CreateItemInput {
  userId: string;
}

export async function createItem(data: CreateItemParams) {

  const item = await Item.create({
    userId: data.userId,

    name: {
      value: data.name,
      checked: false
    },

    quantity: {
      value: data.quantity,
      checked: false
    },

    price: {
      value: data.price,
      checked: false
    },

    purchased: false
  });

  return item;
}

export async function getItemsByUser(userId: string) {

  return Item.find({ userId });

}

export async function updateItem(itemId: string, data: any) {

  console.log("🔧 Service updateItem");
  console.log("📌 itemId:", itemId);
  console.log("📌 data:", data);

    const item = await Item.findByIdAndUpdate(
    itemId,
    data,
    { returnDocument: "after" }
    );

  console.log("📦 Item atualizado:", item);

  return item;

}

export async function deleteItem(itemId: string) {

  console.log("🗑️ Service deleteItem");

  console.log("📌 itemId:", itemId);

  const item = await Item.findByIdAndDelete(itemId);

  console.log("📦 Item removido:", item);

  return item;

}