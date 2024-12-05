import { IAdmin } from "../entityInterface/IAdmin";
import {ICategory} from '../entityInterface/ICategory'
import { CourseApproval, ICourse } from "../entityInterface/ICourse";
import { IEnrolledCourse } from "../entityInterface/IEnrolledCourse";
import { IInstructor } from "../entityInterface/IInstructor";
import { IStudent } from "../entityInterface/IStudent";
// import { EnrolledCountByCategoryAndDate } from "../../interfaces/dashboard";

interface adminDashboardData {
    totalRevenue: number;
    studentCount: number;
    instructorCount: number;
    courseCount: number;
  }
 interface SalesDataPoint {
    timePeriod: number | string; 
    totalRevenue: number;      
  }
  
interface FetchSalesDataResponse {
    data: SalesDataPoint[];    
  }
  

export interface IAdminService{
    login(email:string): Promise <IAdmin>
    getAllCategories(): Promise<ICategory[] | null>;
    addCategory(category: string): Promise<ICategory | null>;
    editCategory(categoryId: string, data: string): Promise<ICategory>;
    listCategory(categoryId: string): Promise<ICategory>;
    unlistCategory(categoryId: string): Promise<ICategory>;
    getAllStudents(): Promise<IStudent[] | null>;
    getAllInstructors(): Promise<IInstructor[] | null>;
    blockStudent(studentId: string): Promise<IStudent>;
    unblockStudent(studentId: string): Promise<IStudent>;
    blockInstructor(instructorId: string): Promise<IInstructor>;
    unblockInstructor(instructorId: string): Promise<IInstructor>;
    getAllCourses(): Promise<ICourse[]>
    getSingleCourse(courseId: string): Promise<ICourse>;
    courseApproval(courseId: string, approval: CourseApproval): Promise<ICourse>;
    adminDashboardData(): Promise<adminDashboardData>;
    fetchSalesData(filter:string): Promise<FetchSalesDataResponse>
    getEnrolledCoursesByAdmin():Promise<IEnrolledCourse[] | null>
}