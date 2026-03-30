import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  categoryId: Schema.Types.ObjectId;
  price: number;
  stock: number;
  minStockThreshold: number;
  status: "Active" | "Out of Stock";
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    minStockThreshold: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["Active", "Out of Stock"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export const Product = model<IProduct>("Product", ProductSchema);
