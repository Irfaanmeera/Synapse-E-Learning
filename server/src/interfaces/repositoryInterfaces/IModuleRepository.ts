import { IChapter, IModule,} from "../entityInterface/IModule";

export interface IModuleRepository {
  createModule(moduleData: IModule): Promise<IModule>;
  updateModule(moduleId: string, updateData: Partial<IModule>): Promise<IModule | null>;
  deleteModule(moduleId: string): Promise<IModule | null>;
  addChapter(moduleId: string, chapterData: IChapter): Promise<IModule | null>;
  findModuleById(moduleId: string): Promise<IModule | null>;
  getTotalChapterCount(courseId:string):Promise<number>;
}