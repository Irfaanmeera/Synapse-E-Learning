import { Student } from "../models/studentModel";
import { IStudent } from "../interfaces/entityInterface/IStudent";
import { IStudentRepository } from "../interfaces/repositoryInterfaces/IStudentRepository";
import { BadRequestError } from "../constants/errors/badrequestError";

export class StudentRepository implements IStudentRepository {

    async createStudent(studentData: IStudent): Promise<IStudent> {
        const student = Student.build(studentData)
        return await student.save();
    }
    async findStudentByEmail(email: string): Promise<IStudent | null> {
        return await Student.findOne({ email })
    }
    async findStudentById(studentId: string): Promise<IStudent | null> {
        const student= await Student.findById(studentId)
        if(!student){
            throw new BadRequestError('Invalid Id')
        }
        return student;
    }
    async updateUserVerification(email: string): Promise<IStudent> {
        const student = await Student.findOne({ email });
        student!.set({ isVerified: true });
        return await student!.save();
        
    }
    async updateStudent(studentData:IStudent): Promise<IStudent>{
        const {id,name,mobile} = studentData;
        const student = await Student.findById(id)
        if(!student){
            throw new BadRequestError('Student not found')
        }
        student.set({
            name,
            mobile
        })
        return await student.save()
    }

    async updateImage(studentId:string,image:string):Promise<IStudent>{
        const student = await Student.findById(studentId)
        if(!student){
            throw new BadRequestError('Invalid Id')
        }
        student.set({
            image,
        })
        return await student.save()
    }
    async udpatePassword(studentId: string, password: string): Promise<IStudent> {
        const student = await Student.findById(studentId);
        if (!student) {
          throw new BadRequestError("Id not valid");
        }
        student.set({
          password,
        });
        return await student.save();
      }

      async courseEnroll(studentId: string, courseId: string): Promise<IStudent> {
          const student = await Student.findById(studentId)
          if(!student){
            throw new BadRequestError('Student not found')
          }
          student.courses?.push(courseId)
          return await student.save()
      }
      async getAllStudents(): Promise<IStudent[] | null> {
        return await Student.find();
      }
      
    
      async blockStudent(studentId: string): Promise<IStudent> {
        const student = await Student.findOne({ _id: studentId });
        student!.set({ isBlocked: true });
        return await student!.save();
      }
    
      async unblockStudent(studentId: string): Promise<IStudent> {
        const student = await Student.findOne({ _id: studentId });
        student!.set({ isBlocked: false });
        return await student!.save();
      }
    
      async getStudentCount(): Promise<number> {
        return await Student.countDocuments();
      }
    
}