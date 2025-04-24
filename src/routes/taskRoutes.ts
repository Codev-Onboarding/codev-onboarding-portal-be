import express from "express";
import { getTaskByUserId, getTaskByChecklist, getTaskByApproved, getAllTasks, updateTaskToComplete, updateTaskToApproved } from "../controllers/taskController";
import { verifyToken } from "../middleware/verifyToken";


const router = express.Router();
router.get("/",verifyToken, getAllTasks);
router.get("/user/:user_id",verifyToken, getTaskByUserId);
router.get("/checklist/:checklistType",verifyToken, getTaskByChecklist);
router.get("/approved-by/:user_id",verifyToken, getTaskByApproved);
router.post("/complete-task/:id",verifyToken, updateTaskToComplete);
router.post("/approve-task/:id",verifyToken, updateTaskToApproved);


export default router;