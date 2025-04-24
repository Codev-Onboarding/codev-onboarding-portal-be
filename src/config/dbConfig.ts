import mongoose from "mongoose";
import dotenv from "dotenv";
import { initSystemAdmin } from "../utils/initAdmin";

const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(
			process.env.MONGODB_URI as string,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as mongoose.ConnectOptions
		);

		console.log("MongoDB Connected");
		await initSystemAdmin();
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

export default connectDB;
