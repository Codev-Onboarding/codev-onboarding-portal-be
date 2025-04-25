import { Router } from "express";
import {
  disableUserById,
  getAllUsers,
  getUserById,
} from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { UserRole } from "../interfaces/userInterface";

const router = Router();

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
  getUserById
);
router.get(
  "/",
  verifyToken,
  authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
  getAllUsers
);
router.patch(
  "/disable/:id",
  verifyToken,
  authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
  disableUserById
);

export default router;
