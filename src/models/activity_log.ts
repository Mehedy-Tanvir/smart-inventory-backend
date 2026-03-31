import { Schema, model, Document } from "mongoose";

export interface IActivityLog extends Document {
  message: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const ActivityLog = model<IActivityLog>(
  "ActivityLog",
  activityLogSchema,
);
