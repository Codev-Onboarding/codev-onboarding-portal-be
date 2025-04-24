import { ITask } from "./taskInterface";

export interface INewHire extends Document {
    _id: string;
    user_id: string;
    email: string;
    name: string;
    startDate: Date;
    tasks: ITask[];
    e201Link?:string;
    createdAt: Date;
    updatedAt: Date;
  }

