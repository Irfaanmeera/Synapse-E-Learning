import { Course } from "./course";
import { User } from "./User";
export interface EnrolledCourse {
  id?: string;
  courseId?: string | Course;
  price?: number;
  date?: Date;
  status?: boolean;
  studentId?: string | User;
  progression?: string[];
  notes?: string[];
}