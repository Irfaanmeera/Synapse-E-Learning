import {ICourse, CourseApproval,ISearch } from "../entityInterface/ICourse"

export interface ICourseRepository {
    createCourse(courseDeatils: ICourse): Promise<ICourse>;
    getAllCourses(page: number): Promise<{ courses: ICourse[]; totalCount: number } | null>;
    getCourseByInstructor(instructorId: string,page: number): Promise<{ courses: ICourse[]; totalCount: number } | null>;
    getSingleCourseForInstructor(courseId: string): Promise<ICourse | null>;
    getCoursesByCategory(categoryId:string,page:number,limit:number): Promise<{courses: ICourse[];total: number;} | null> ;
    getCoursesByApproval(approval: CourseApproval): Promise<ICourse[] | null>;
    updateCourse(courseId:string, courseDetails: ICourse): Promise<ICourse>;
    addModule(courseId: string,module: { module: string; order: number }): Promise<ICourse>;
    findCourseById(courseId: string): Promise<ICourse | null>;
    courseApproval(courseId: string, status: string): Promise<ICourse>;
    addCourseImage(courseId: string, image: string): Promise<ICourse>;
    listCourse(courseId: string): Promise<ICourse>;
    unlistCourse(courseId: string): Promise<ICourse>;
    getListedCourses({page,category,}: {page: number;category?: string;}): Promise<{courses: ICourse[];totalCount: number;} | null>;
    getCourseByAdmin():Promise<ICourse[]>
    searchCoursesForStudents(details: ISearch): Promise<ICourse[] | null>;
    getSingleCourseForAdmin(courseId: string): Promise<ICourse | null>;
    getCourseCount(): Promise<number>;
}