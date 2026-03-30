import { Schema, model } from "mongoose";

interface ICategory {
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default model<ICategory>("Category", categorySchema);
