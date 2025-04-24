import mongoose, { Schema, model } from "mongoose";
import { INewHire } from "../interfaces/newHireInterface";
import { TaskModel, TaskSchema } from "./taskModel";

const NewHireSchema = new Schema<INewHire>(
  {
    user_id: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    tasks: [{ task_id: { type: Schema.Types.ObjectId, ref: "Task" } }],
    e201Link: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

export const NewHireModel = mongoose.model<INewHire>("NewHire", NewHireSchema);
