import { IStudent } from "../entityInterface/IStudent";

export interface IStudentRepository {
  createStudent(studentData: IStudent): Promise<IStudent>;
  findStudentByEmail(email: string): Promise<IStudent | null>;
  findStudentById(studentId:string):Promise<IStudent | null>;
  updateUserVerification(email: string): Promise<IStudent>;
  updateStudent(studentData:IStudent):Promise<IStudent>;
  updateImage(studentId:string,image:string):Promise<IStudent>;
  updatePassword(studentId: string, password: string): Promise<IStudent | null>;
  courseEnroll(studentId: string, courseId: string): Promise<IStudent>;
  getAllStudents(): Promise<IStudent[] | null>;
  getStudentCount(): Promise<number>;
  blockStudent(studentId: string): Promise<IStudent | null>;
  unblockStudent(studentId: string): Promise<IStudent | null>;
}