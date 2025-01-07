import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { id } from "../../../frontend/node_modules/next/dist/compiled/webpack/bundle5";

export const createTask = async (req: Request, res: Response) => {
  try {
    const count = await Task.countDocuments();
    const task = new Task({
      ...req.body,
      order: count,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort("order").populate("relatedTasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedTasks");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Reorder remaining tasks
    await Task.updateMany(
      { order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderTasks = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    const updates = tasks.map(({ id, order }: { id: string; order: number }) =>
      Task.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updates);

    const updatedTasks = await Task.find().sort("order");
    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
