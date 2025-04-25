import express from "express";
import {
  createNewHire,
  getAllNewHires,
  getNewHireById,
  updateNewHireById,
  deleteNewHireById,
} from "../controllers/newHireController";
import { UserRole } from "../interfaces/userInterface";
import { authenticate } from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles(UserRole.HR, UserRole.SystemAdmin),
  getAllNewHires
); // GET /api/new-hires
router.get(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.HR, UserRole.SystemAdmin),
  getNewHireById
); // GET /api/new-hires/:id
router.put(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.HR, UserRole.SystemAdmin),
  updateNewHireById
); // PUT /api/new-hires/:id
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.HR, UserRole.SystemAdmin),
  deleteNewHireById
); // DELETE /api/new-hires/:id

export default router;
