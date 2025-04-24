import "express";

declare module "express-serve-static-core" {
	interface Request {
		user?: any;
		role?: string;
	}
}
