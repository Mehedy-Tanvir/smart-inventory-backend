import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    res
      .status(201)
      .json({ user: { email: user.email, role: user.role }, token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    res
      .status(200)
      .json({ user: { email: user.email, role: user.role }, token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    console.log({ decoded });

    res.status(200).json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
};
