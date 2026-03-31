import { Request, Response } from "express";
import { ActivityLog } from "../models/activity_log";

export const getRecentActivities = async (req: Request, res: Response) => {
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);

  res.json({
    success: true,
    data: logs,
  });
};
