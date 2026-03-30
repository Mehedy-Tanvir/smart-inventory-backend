import { Schema, model, Document } from "mongoose";

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerName: string;
  products: IOrderItem[];
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    products: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", OrderSchema);
