import { Request, Response } from "express";
import Task from "../models/Task";

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await Task.countDocuments();
    const task = new Task({
      ...req.body,
      order: count,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort("order").populate("relatedTasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedTasks");

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Reorder remaining tasks
    await Task.updateMany(
      { order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const reorderTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tasks } = req.body;

    const updates = tasks.map(({ id, order }: { id: string; order: number }) =>
      Task.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updates);

    const updatedTasks = await Task.find().sort("order");
    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
