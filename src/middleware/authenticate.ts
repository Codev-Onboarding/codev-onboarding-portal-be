import jwt from "jsonwebtoken";
import User from "../models/authModel";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      res.status(401).json({ message: "Access Denied" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const userId = decoded._id;

    const findUser = await User.findById(userId);

    if (!findUser) {
      res.status(403).json({ message: "Invalid Token1" });
      return;
    }

    const user = findUser.toJSON();
    req.user = user;
    req.role = user.role;

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
    return;
  }
};
