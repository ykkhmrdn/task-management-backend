import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../src/controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/reorder", reorderTasks);

export default router;
