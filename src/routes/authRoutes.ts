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
import { verifyToken } from "../middleware/verifyToken";
import { verifyEnabled } from "../middleware/verifyEnabled";
import { authenticate } from "../middleware/authenticate";
import { createNewHire } from "../controllers/newHireController";
import { createTasksInRegister } from "../controllers/taskController";

const router = Router();

router.post(
	"/register",
	verifyToken,
	authorizeRoles(UserRole.SystemAdmin,UserRole.HR),
	register
);

router.post(
	"/register-new-hire",
	verifyToken,
	authorizeRoles(UserRole.HR,UserRole.SystemAdmin),
	registerNewHire,
	createTasksInRegister,
	createNewHire
);

router.post("/login", verifyEnabled, login);
router.post("/reset-password", verifyEnabled, resetPassword);

router.get("/validateToken", authenticate, validateToken);

export default router;
