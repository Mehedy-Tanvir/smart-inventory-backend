import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  minStockThreshold: number;
  status: "Active" | "Out of Stock";
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    minStockThreshold: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Active", "Out of Stock"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", ProductSchema);
