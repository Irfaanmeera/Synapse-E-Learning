import {IInstructor } from "../entityInterface/IInstructor";
import { ICourse } from "../entityInterface/ICourse";
import {IModule,IChapter} from '../entityInterface/IModule';
import { ICategory } from "../entityInterface/ICategory";
import { IEnrolledCourse } from "../entityInterface/IEnrolledCourse";




export interface IInstructorService{
    signup(studentDetails: Partial<IInstructor>): Promise<IInstructor|null>;
    login(email:string):Promise<IInstructor>;
    verifyInstructor(email: string): Promise<IInstructor>;
    findInstructorById(instructorId: string): Promise<IInstructor | null>;
    updateInstructor(data: Partial<IInstructor>): Promise<IInstructor>;
    updateInstructorImage(instructorId:string,file:Express.Multer.File): Promise<IInstructor>;
    getMyCourses(instructorId: string,page: number): Promise<{ courses: ICourse[]; totalCount: number } | null>;
    createCourse(courseDetails: ICourse, file: Express.Multer.File): Promise<ICourse>;
    getSingleCourse(courseId: string): Promise< ICourse| null>;
    updateCourse(courseId: string, courseDetails: ICourse,file:Express.Multer.File): Promise<ICourse>;
    deleteCourse(courseId: string): Promise<ICourse>;
    listCourse(courseId:string): Promise <ICourse>;
    getAllCategories(): Promise<ICategory[] | null>;
    createModule(moduleDetails: IModule, order:number): Promise<IModule>;
    resetForgotPassword(email: string, password: string): Promise<IInstructor>;
    // updateModule(moduleId: string, updateData: Partial<IModule>): Promise<IModule | null>;
    // deleteModule(moduleId: string): Promise<IModule | null>;
    addChapter(moduleId: string, chapter: IChapter,file?: Express.Multer.File): Promise<IModule |null>;
    getEnrolledCoursesByInstructor(instructorId:string):Promise<IEnrolledCourse[] | null>
    }
