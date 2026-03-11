import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    value: String,
    checked: Boolean
  },

  quantity: {
    value: Number,
    checked: Boolean
  },

  price: {
    value: Number,
    checked: Boolean
  },

  purchased: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const Item = mongoose.model("Item", ItemSchema);