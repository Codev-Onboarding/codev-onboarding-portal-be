import express from "express";
import {
  createNewHire,
  getAllNewHires,
  getNewHireById,
  updateNewHireById,
  deleteNewHireById,
} from "../controllers/newHireController";

const router = express.Router();

router.get("/", getAllNewHires); // GET /api/new-hires
router.get("/:id", getNewHireById); // GET /api/new-hires/:id
router.put("/:id", updateNewHireById); // PUT /api/new-hires/:id
router.delete("/:id", deleteNewHireById); // DELETE /api/new-hires/:id

export default router;