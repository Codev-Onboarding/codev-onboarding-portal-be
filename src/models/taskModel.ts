import mongoose, { Schema } from "mongoose";
import { Checklist, ITask, TaskStatus } from "../interfaces/taskInterface";

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    description: { type: String, required: true },
    checklistType: { type: String, enum: Object.values(Checklist), required: true },
    videoEmbbed: { type: String, required: false },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(TaskStatus), required: true, default: TaskStatus.PENDING },
    referenceLink: { type: String, required: false },
    approvedBy: { type: String, required: false },
    approvalNote: { type: String, required: false },
    approvedAt: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now }
  });
  
  export const TaskModel = mongoose.model("Task", TaskSchema);
  export { TaskSchema };