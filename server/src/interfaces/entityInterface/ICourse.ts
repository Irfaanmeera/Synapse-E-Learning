import { IModule } from "./IModule";

export enum CourseApproval {
    pending = "Pending",
    rejected = "Rejected",
    approved = "Approved",
}

export interface ICourse {
    id?: string;
    name?: string;
    description?: string;
    instructor?: string;
    image?: string;
    price?: number;
    level?: string;
    enrolled?: number;
    category?: string;
    modules?: { module: string | IModule; order: number }[];
    createdAt?: Date;
    status?: boolean;
    approval?: CourseApproval;
}
export interface ISearch {
    category?: string;
    level?: string;
    language?: string;
    $or?: (
      | { name: { $regex: string; $options: string } }
      | { description: { $regex: string; $options: string } }
    )[];
  }