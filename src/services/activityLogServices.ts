import { ActivityLog } from "../models/activity_log";

export const logActivity = async (message: string) => {
  try {
    await ActivityLog.create({ message });
  } catch (error) {
    console.error("Activity log failed:", error);
  }
};
