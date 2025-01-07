import express from "express";
import {
  createTask,
  getTasks,
  reorderTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/reorder", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
