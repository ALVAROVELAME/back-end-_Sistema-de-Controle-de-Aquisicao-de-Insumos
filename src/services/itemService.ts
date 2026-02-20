import { Item } from "../models/Item";

export function createItem(data: any) {
  return Item.create(data);
}

export function listItems(userId: string) {
  return Item.find({ userId });
}

export function toggleItem(id: string) {
  return Item.findByIdAndUpdate(
    id,
    [{ $set: { bought: { $not: "$bought" } } }],
    { new: true }
  );
}

export function deleteItem(id: string) {
  return Item.findByIdAndDelete(id);
}