import { Schema, model, Document, Types } from "mongoose";

export interface IRestockQueue extends Document {
  productId: Types.ObjectId;
  currentStock: number;
  priority: "Low" | "Medium" | "High";
}

const RestockQueueSchema = new Schema<IRestockQueue>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    currentStock: { type: Number, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  { timestamps: true },
);

export const RestockQueue = model<IRestockQueue>(
  "RestockQueue",
  RestockQueueSchema,
);
