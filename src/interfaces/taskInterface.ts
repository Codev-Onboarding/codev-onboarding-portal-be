import { IEmbeddedVideo } from "./embeddedVideoInterface";

export interface ITask extends Document {
    _id: string;
    user_id: string;
    title: string;
    description: string;
    checklistType: Checklist;
    videoEmbbed?: IEmbeddedVideo
    dueDate?: Date;
    status: TaskStatus;
    referenceLink?: string;
    approvedBy?: string;
    approvalNote?: string
    approvedAt?: Date
    createdAt: Date;
  }

  export enum TaskStatus {
    INC = 'INCOMPLETE',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    VERIFIED = 'VERIFIED',
  }

  export enum Checklist  {
    PRE = "Pre-employment",
    TRP = "Talent Readiness Program",
    IT = "IT Provisioning"
   }