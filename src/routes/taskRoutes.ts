import express, { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/taskController";

const router: Router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/reorder", reorderTasks);

export default router;
