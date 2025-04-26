import express from "express";
import {
  addTaskToUserById,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  updateTaskInfo,
  updateTaskStatus,
} from "../controllers/taskController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();
router.get("/", authenticate, getAllTasks);
router.get("/:id", authenticate, getTaskById);
router.patch("/:id/status", authenticate, updateTaskStatus);
router.patch("/:id", authenticate, updateTaskInfo);
router.post("/:id/new-hire", authenticate, addTaskToUserById);

router.delete("/:id", authenticate, deleteTaskById);

export default router;
