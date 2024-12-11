import { IInstructor } from "../entityInterface/IInstructor";
// import { ICourse } from "../../interfaces/course";
// import { IModule } from "../../interfaces/module";
// import { IChapter } from "../../interfaces/module";
// import { ICategory } from "../../interfaces/category";
// import { ILevel } from "../../interfaces/level";
// import { ILanguage } from "../../interfaces/language";


export interface IInstructorRepository {
  createInstructor(instructorData: IInstructor): Promise<IInstructor>;
  findInstructorByEmail(email: string): Promise<IInstructor | null>;
  findInstructorById(instructorId: string): Promise<IInstructor | null>;
  updateInstructorVerification(email: string): Promise<IInstructor>;
  updateInstructor(data: Partial<IInstructor>): Promise<IInstructor>;
  updateInstructorImage(instructorId:string,image:string):Promise<IInstructor>;
  updatePassword(instructorId: string, password: string): Promise<IInstructor>;
  addToWallet(instructorId: string, amount: number): Promise<IInstructor>;
  addWalletHistory(instructorId: string,amount: number,description: string): Promise<IInstructor>;
  getAllInstructors(): Promise<IInstructor[] | null>;
  getInstructorCount(): Promise<number>;
  blockInstructor(instructorId: string): Promise<IInstructor | null>;
  unblockInstructor(instructorId: string): Promise<IInstructor | null>;
  
}