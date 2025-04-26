import { Router } from "express";
import {
	register,
	login,
	resetPassword,
	registerNewHire,
	validateToken,
} from "../controllers/authController";
import { UserRole } from "../interfaces/userInterface";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { authenticate } from "../middleware/authenticate";
import { verifyEnabled } from "../middleware/verifyEnabled";
import { createNewHire } from "../controllers/newHireController";
import { createTasksInRegister } from "../controllers/taskController";

const router = Router();

router.post(
	"/register",
	authenticate,
	authorizeRoles(UserRole.SystemAdmin,UserRole.HR),
	register
);

router.post(
	"/register/new-hire",
	authenticate,
	authorizeRoles(UserRole.HR,UserRole.SystemAdmin),
	registerNewHire,
	createTasksInRegister,
	createNewHire
);

router.post("/login", verifyEnabled, login);
router.post("/reset-password", verifyEnabled, resetPassword);

router.get("/validateToken", authenticate, validateToken);

export default router;
