import { Router } from "express";
import {
	register,
	login,
	resetPassword,
	registerNewHire,
	adminUserCreate,
	adminUserUpdate,
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
	authorizeRoles(UserRole.SystemAdmin),
	register
);

router.post(
	"/register-new-hire",
	// verifyToken,
	// authorizeRoles(UserRole.HR),
	registerNewHire,
	createTasksInRegister,
	createNewHire
);

router.post("/login", verifyEnabled, login);
router.post("/reset-password", verifyEnabled, resetPassword);

router.post(
	"/admin-user-create",
	authenticate,
	authorizeRoles(UserRole.HR),
	adminUserCreate
);

router.put(
	"/admin-user-update/:userId",
	authenticate,
	authorizeRoles(UserRole.HR),
	adminUserUpdate
);

router.get("/validateToken", authenticate, validateToken);

export default router;
