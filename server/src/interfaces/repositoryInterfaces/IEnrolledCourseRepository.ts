import { IEnrolledCourse } from "../entityInterface/IEnrolledCourse";


export interface IEnrolledCourseRepository {
    createCourse(courseDeatils: IEnrolledCourse): Promise<IEnrolledCourse>;
    getCourseById(courseId: string): Promise<IEnrolledCourse>;
    getCourseByStudentIdAndCourseId(studentId: string,courseId: string): Promise<IEnrolledCourse | null>;
    getEnrolledCoursesByStudent(studentId: string): Promise<IEnrolledCourse[]>;
    getEnrolledCoursesByCourseId(couresId: string): Promise<IEnrolledCourse[]>;
    getEnrolledCoursesByInstructor(instructorId:string):Promise<IEnrolledCourse[]>
    getEnrolledCoursesByAdmin():Promise<IEnrolledCourse[]>
    checkEnrolledCourse(courseId: string, studentId: string): Promise<IEnrolledCourse | null>;
    addModuleToProgression(enrolledId: string,chapterTitle: string): Promise<IEnrolledCourse>;
    completedStatus(enrolledId: string): Promise<void>;
    getTotalRevenue(): Promise<number>;
}