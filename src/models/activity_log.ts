import { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  message: string;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const ActivityLog = model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema,
);
