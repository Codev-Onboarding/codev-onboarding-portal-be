// createTask
import { Request, Response } from "express";
import { NewHireModel } from "../models/newHireModel";
import { ITask, TaskStatus } from "../interfaces/taskInterface";
import { TaskModel } from "../models/taskModel";
import { UserRole } from "../interfaces/userInterface";
export const createTasksInRegister = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    console.log("createTasksInRegister", req.body);

    const tasks = req.body.tasks;
    const savedTasks = await Promise.all(
      tasks.map(async (task: ITask) => {
        console.log("task", task);

        const newTask = new TaskModel({
          ...task,
          user_id: req.body.user_id,
        });
        const savedTask = await newTask.save();
        return savedTask;
      })
    );

    console.log("savedTasks", savedTasks);

    const savedTaskIds = savedTasks.map((task) => task._id);
    console.log("savedTaskIds", savedTaskIds);
    req.body.tasks = savedTaskIds;
    next();
  } catch (err: any) {
    console.log("123", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Example query: tasks?status=PENDING&checklistType=Pre-employment&user_id=12345&approvedBy=manager&page=1&limit=5&filter=onboarding&sort=title:asc,description:desc
  try {
    const {
      status,
      page = 1,
      limit = 10,
      filter,
      sort,
      user_id,
      approvedBy,
      checklistType,
    } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    if (user_id) {
      query.user_id = user_id;
    }

    if (approvedBy) {
      query.approvedBy = approvedBy;
    }

    if (checklistType) {
      query.checklistType = checklistType;
    }

    if (filter) {
      const filterString = Array.isArray(filter)
        ? filter.join("")
        : filter.toString();
      query.$or = [
        { title: { $regex: new RegExp(filterString, "i") } },
        { description: { $regex: new RegExp(filterString, "i") } },
      ];
    }

    const pageNumber = parseInt(page as string, 10);
    const limitQuery = parseInt(limit as string, 10);

    const sortQuery: { [key: string]: 1 | -1 } = {};
    if (sort) {
      const sortArray = sort.toString().split(",");
      sortArray.forEach((sortString) => {
        const [key, value] = sortString.split(":");
        sortQuery[key] = value === "asc" ? 1 : -1;
      });
    }

    const tasks = await TaskModel.find(query)
      .sort(sortQuery)
      .skip((pageNumber - 1) * limitQuery)
      .limit(limitQuery)
      .exec();

    const totalTasks = await TaskModel.countDocuments(query).exec();

    const tasksWithNewHireDetails = await Promise.all(
      tasks.map(async (task) => {
        const newHire = await NewHireModel.findOne({ user_id: task.user_id });
        return {
          ...task.toObject(),
          newHire: newHire
            ? { email: newHire.email, name: newHire.name }
            : null,
        };
      })
    );

    res.json({
      tasks: tasksWithNewHireDetails,
      limit: limitQuery,
      page: pageNumber,
      total: totalTasks,
      length: tasks.length,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getTaskByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
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
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateTaskToIncomplete = async (req: any, res: any): Promise<void> => {
  try {
    console.log(req.user.role);
    
    if (req.user.role !== UserRole.HR && req.user.role !== UserRole.SystemAdmin)
      return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const task = await TaskModel.findById(id);
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
export const updateTaskStatus = async (req: any, res: any): Promise<void> => {
  try {
    console.log('updateTaskStatus');
    switch (req.body.status) {
      case TaskStatus.COMPLETED:
        console.log('COMPLETED');
        
        await updateTaskToComplete(req, res);
        break;

      case TaskStatus.INC:
        console.log('INC');
        await updateTaskToIncomplete(req, res);
        break;

      case TaskStatus.VERIFIED:
        await updateTaskToVerified(req, res);
        break;

      default:
        res.status(403).json({ message: "Forbidden" });
        break;
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const updateTaskToComplete = async (req: any, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, referenceLink } = req.body;
    console.log("referenceLink",referenceLink);
    
    const task = await TaskModel.findById(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (req.user.role === UserRole.Employee) {
      task.status = status;
      task.referenceLink = referenceLink;
      await task.save();
      res.json(task);
    } else {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateTaskToVerified = async (req: any, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
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

export const addTaskToUserById = async (req: any, res: any): Promise<void> => {
  // Example request:

  try {
    console.log(req.params);

    const { id } = req.params;
    const tasks = req.body.tasks;
    const newTasks = await Promise.all(
      tasks.map(async (task: ITask) => {
        console.log({ id }, id);

        task.user_id = id;
        console.log(task);

        const newTask = new TaskModel({ ...task, id });
        const savedTask = await newTask.save();
        return savedTask._id;
      })
    );
    const newHire = await NewHireModel.findOneAndUpdate(
      { user_id: id },
      { $push: { tasks: newTasks } },
      { new: true }
    );
    if (!newHire) {
      res.status(404).json({ message: "New hire not found" });
      return;
    }
    res.json(newHire);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const updateTaskInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, dueDate },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
export const deleteTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    await NewHireModel.updateMany(
      { tasks: { $in: [task._id] } },
      { $pull: { tasks: task._id } }
    );
    res.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
