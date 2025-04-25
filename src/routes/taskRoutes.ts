import express from "express";
import {
  getTaskByUserId,
  getTaskByChecklist,
  getTaskByApproved,
  getAllTasks,
  updateTaskToComplete,
  updateTaskToApproved,
  updateTaskToIncomplete,
  getTaskById,
  addTaskToUserById,
  updateTaskInfo,
} from "../controllers/taskController";
import { verifyToken } from "../middleware/verifyToken";
import { UserRole } from "../interfaces/userInterface";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();
// ALL
router.get("/user/:user_id", verifyToken, authorizeRoles(), getTaskByUserId);
router.get("/:id", verifyToken, getTaskById);
// NEW HIRE
router.post("/complete-task/:id", verifyToken, updateTaskToComplete);

// By checklist Role
router.get("/checklist/:checklistType", verifyToken, getTaskByChecklist);
// HR ADMIN
router.patch("/:id", verifyToken, updateTaskInfo);
router.post("/approve-task/:id", verifyToken, updateTaskToApproved);
router.post("/incomplete-task/:id", verifyToken, updateTaskToIncomplete);
router.get(
  "/",
  verifyToken,
  authorizeRoles(UserRole.SystemAdmin, UserRole.HR),
  getAllTasks
);
router.get("/approved-by/:user_id", verifyToken, getTaskByApproved);
router.post("/add-task/user/:id", verifyToken, addTaskToUserById);

export default router;
