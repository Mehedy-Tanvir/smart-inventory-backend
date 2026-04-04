import { Request, Response } from "express";
import user from "../models/user";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await user.find().select("email role");

    res.status(200).json(
      users.map((u) => ({
        id: u._id,
        email: u.email,
        role: u.role,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const foundUser = await user.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    // only allow manager → admin
    if (foundUser.role !== "manager") {
      return res.status(400).json({
        message: "Only managers can be promoted to admin",
      });
    }

    foundUser.role = "admin";
    await foundUser.save();

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: {
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to promote user",
    });
  }
};
