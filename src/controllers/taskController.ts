// createTask
import { Request, Response } from "express";
import { NewHireModel } from "../models/newHireModel";
import { ITask, TaskStatus } from "../interfaces/taskInterface";
import { TaskModel } from "../models/taskModel";

export const createTasksInRegister = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    console.log('createTasksInRegister', req.body);

    const tasks = req.body.tasks;
    const savedTasks = await Promise.all(
      tasks.map(async (task: ITask) => {
        console.log('task', task);

        const newTask = new TaskModel({
          ...task,
          user_id: req.body.user_id,
        });
        const savedTask = await newTask.save();
        return savedTask;
      })
    );
    
    console.log('savedTasks', savedTasks);

    const savedTaskIds = savedTasks.map((task) => task._id);
    console.log('savedTaskIds', savedTaskIds);
    req.body.tasks = savedTaskIds;
    next()
  } catch (err: any) {
    console.log('123',err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await TaskModel.find();
    if (!tasks) {
      res.status(404).json({ message: "Tasks not found" });
      return;
    }
    const tasksWithNewHireDetails = await Promise.all(
      tasks.map(async (task) => {
        const newHire = await NewHireModel.findOne({ user_id: task.user_id });
        if (!newHire) {
          return task;
        }
        return {
          ...task.toObject(),
          newHire: {
            email: newHire.email,
            name: newHire.name,
          },
        };
      })
    );
    res.json(tasksWithNewHireDetails);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const getTaskByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    console.log(req.params);
    
    const tasks = await TaskModel.find({ user_id });
    if (!tasks) {
      res.status(404).json({ message: "Tasks not found" });
      return;
    }
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getTaskByChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { checklistType } = req.params;
    const tasks = await TaskModel.find({ checklistType });
    if (!tasks) {
      res.status(404).json({ message: "Tasks not found" });
      return;
    }
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const getTaskByApproved = async (req: Request, res: Response): Promise<void> => {
  try {
    const { approvedBy } = req.params;
    const tasks = await TaskModel.find({ approvedBy });
    if (!tasks) {
      res.status(404).json({ message: "Tasks not found" });
      return;
    }
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateTaskToIncomplete = async (req: any, res: any): Promise<void> => {
  try {
    const { task_id } = req.params;
    const task = await TaskModel.findById(task_id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    task.status = TaskStatus.INC;
    task.approvalNote = req.body.approvalNote;
    task.approvedBy = req.user._id;
    task.approvedAt = new Date(Date.now());
    await task.save();
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateTaskToComplete = async (req: any, res: any): Promise<void> => {
  try {
    const { task_id } = req.params;
    const task = await TaskModel.findById(task_id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    task.status = TaskStatus.COMPLETED; 
    task.referenceLink = req.body.referenceLink;
    await task.save();
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const updateTaskToApproved = async (req: any, res: any): Promise<void> => {
  try {
    const { task_id } = req.params;
    const task = await TaskModel.findById(task_id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    task.status = TaskStatus.VERIFIED;
    task.approvalNote = req.body.approvalNote;
    task.approvedBy = req.user._id;
    task.approvedAt = new Date(Date.now());
    await task.save();
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

