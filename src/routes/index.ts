import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import newHireRoutes from "./newHireRoutes";
import taskRoutes from "./taskRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/new-hires", newHireRoutes);
router.use("/tasks", taskRoutes);

export default router;
