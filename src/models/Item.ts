import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    price: Number,
    bought: Boolean,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);