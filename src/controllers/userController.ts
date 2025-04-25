import User from "../models/authModel";
import { Request, Response } from "express";

import mongoose from "mongoose";
import { createUser, passwordGenerate } from "../utils/authUtils";
import { welcomeEmail } from "../mailer/newHire";

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

		const usersTotal = await User.countDocuments(query).exec();

		res.json({
			users,
			limit,
			page,
			total: usersTotal,
			length: users?.length || 0,
		});
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

export const adminUserCreate = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const password = passwordGenerate();

		const userData: any = { ...req.body, password };

		const result: any = await createUser(req, res, userData);

		if (!result.success) {
			res.status(400).json({ message: result.message });
			return;
		}

		await welcomeEmail(result?.user?.email, result?.user?.name);
		res.status(200).json({ message: "New User Succesfully created" });
	} catch (err) {
		const error = err instanceof Error ? err.message : "Unknown error";
		res.status(500).json({ message: error });
	}
};

export const adminUserUpdate = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId: string = req.params?.userId || "";

		const user = await User.findById(userId);

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		Object.assign(user, req.body);

		await user.save();

		res.status(200).json({ message: "User successfully updated", user });
	} catch (err) {
		const error = err instanceof Error ? err.message : "Unknown error";
		res.status(500).json({ message: error });
	}
};
