import User from "../models/authModel";
import { Request, Response } from "express";

import mongoose from "mongoose";

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // GET /users/:userId
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(id);
    console.log(objectId);
    const user = await User.findById(objectId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  // GET /users?role=Employee&page=1&limit=10&filter=john&sort=name:asc,email:desc
  try {
    const { role, page = 1, limit = 10, filter, sort } = req.query;
    console.log(role, page, limit, filter, sort);
    const query = {} as any;
    if (role) {
      query.role = role;
    }
    if (filter) {
      const filterString = Array.isArray(filter)
        ? filter.join("")
        : filter.toString();
      query.$or = [
        { name: { $regex: new RegExp(filterString, "i") } },
        { email: { $regex: new RegExp(filterString, "i") } },
      ];
    }
    const pageNumber = parseInt(page as string, 10);
    const limitQuery = parseInt(limit as string, 10);
    const sortQuery: { [key: string]: -1 | 1 } = {};
    if (sort) {
      const sortArray = sort.toString().split(",");
      sortArray.forEach((sortString) => {
        const [key, value] = sortString.split(":");
        sortQuery[key] = value === "asc" ? 1 : -1;
      });
    }
    const users = await User.find(query)
      .sort(sortQuery)
      .skip((pageNumber - 1) * limitQuery)
      .limit(limitQuery)
      .exec();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const disableUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findByIdAndUpdate(
      objectId,
      { enabled: false },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User disabled successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
