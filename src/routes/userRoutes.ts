import { Router } from "express";
import {
	adminUserCreate,
	adminUserUpdate,
	disableUserById,
	getAllUsers,
	getUserById,
} from "../controllers/userController";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { UserRole } from "../interfaces/userInterface";
import { authenticate } from "../middleware/authenticate";
const router = Router();

router.get(
	"/get-user/:id",
	authenticate,
	authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
	getUserById
);
router.get(
	"/get-all-users",
	authenticate,
	authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
	getAllUsers
);
router.patch(
	"/disable-user/:id",
	authenticate,
	authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
	disableUserById
);

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

export default router;
