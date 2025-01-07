import { Request, Response } from "express";
import mongoose from "mongoose";
import Task, { ITask } from "../models/Task";

interface TaskReorder {
  _id: string;
  order: number;
}

// Response interfaces
interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.title || !req.body.description) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: "Title and description are required",
      });
      return;
    }

    const count = await Task.countDocuments();
    const task = new Task({
      ...req.body,
      order: count,
    });
    const savedTask = await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: savedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: (error as Error).message,
    });
  }
};

export const getTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort("order").populate("relatedTasks");

    res.json({
      success: true,
      message: tasks.length ? "Tasks retrieved successfully" : "No tasks found",
      data: tasks,
      total: tasks.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
      error: (error as Error).message,
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID format",
        error: "Invalid ID",
      });
      return;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedTasks");

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
        error: "Task with the specified ID does not exist",
      });
      return;
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: (error as Error).message,
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID format",
        error: "Invalid ID",
      });
      return;
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
        error: "Task with the specified ID does not exist",
      });
      return;
    }

    await Task.updateMany(
      { order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: (error as Error).message,
    });
  }
};

export const reorderTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tasks } = req.body as { tasks: TaskReorder[] };

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid request format",
        error: "Tasks array is required and cannot be empty",
      });
      return;
    }

    // Validate task IDs
    for (const task of tasks) {
      if (!mongoose.Types.ObjectId.isValid(task._id)) {
        res.status(400).json({
          success: false,
          message: "Invalid task ID format",
          error: `Invalid ID: ${task._id}`,
        });
        return;
      }
    }

    // Update tasks in parallel
    const updates = tasks.map((task) =>
      Task.findByIdAndUpdate(
        task._id,
        { $set: { order: task.order } },
        { new: true }
      )
    );

    const updatedTasks = await Promise.all(updates);

    // Check if any task was not found
    if (updatedTasks.some((task) => !task)) {
      res.status(404).json({
        success: false,
        message: "One or more tasks not found",
        error: "Some tasks could not be updated",
      });
      return;
    }

    const sortedTasks = await Task.find().sort("order");
    res.json({
      success: true,
      message: "Tasks reordered successfully",
      data: sortedTasks,
    });
  } catch (error) {
    console.error("Reorder error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder tasks",
      error: (error as Error).message,
    });
  }
};
