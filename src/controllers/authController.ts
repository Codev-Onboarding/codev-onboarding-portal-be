import { welcomeEmail } from "./../mailer/newHire";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/authModel";
import { createUser, passwordGenerate } from "../utils/authUtils";
import { UserRole } from "../interfaces/userInterface";

export const validateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  res.json({ user: user, message: "Token Valid" });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result: any = await createUser(req, res, req.body);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET as string
      // Removed for development
      // {
      // 	expiresIn: "1h",
      // }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: error });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Email does not exist." });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Password incorrect." });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match." });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: error });
  }
  next();
};

export const registerNewHire = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    req.body.password = "P@ssword1";
    req.body.role = UserRole.Employee;
    const result: any = await createUser(req, res, req.body);
    console.log("registerNewHire", result);

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    welcomeEmail(req.body.email, req.body.name, req.body.password);
    req.body.user_id = result.user._id;
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
