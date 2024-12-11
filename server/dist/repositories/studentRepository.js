"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
/* eslint-disable react/no-is-mounted */
const baseRepository_1 = require("./baseRepository"); // Adjust the import path as per your project structure
const studentModel_1 = require("../models/studentModel");
const badrequestError_1 = require("../constants/errors/badrequestError");
class StudentRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(studentModel_1.Student); // Pass the Student model to the BaseRepository
    }
    createStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(studentData);
        });
    }
    findStudentByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    }
    findStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Invalid Id");
            }
            return student;
        });
    }
    updateUserVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findOne({ email });
            if (!student) {
                throw new badrequestError_1.BadRequestError("Student not found");
            }
            student.set({ isVerified: true });
            return yield student.save();
        });
    }
    updateStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, mobile } = studentData;
            const student = yield this.findById(id);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Student not found");
            }
            student.set({ name, mobile });
            return yield student.save();
        });
    }
    updateImage(studentId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Invalid Id");
            }
            student.set({ image });
            return yield student.save();
        });
    }
    updatePassword(studentId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Id not valid");
            }
            student.set({ password });
            return yield student.save();
        });
    }
    courseEnroll(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Student not found");
            }
            (_a = student.courses) === null || _a === void 0 ? void 0 : _a.push(courseId);
            return yield student.save();
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll();
        });
    }
    blockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Student not found");
            }
            student.set({ isBlocked: true });
            return yield student.save();
        });
    }
    unblockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Student not found");
            }
            student.set({ isBlocked: false });
            return yield student.save();
        });
    }
    getStudentCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.count();
        });
    }
}
exports.StudentRepository = StudentRepository;
// import { Student } from "../models/studentModel";
// import { IStudent } from "../interfaces/entityInterface/IStudent";
// import { IStudentRepository } from "../interfaces/repositoryInterfaces/IStudentRepository";
// import { BadRequestError } from "../constants/errors/badrequestError";
// export class StudentRepository implements IStudentRepository {
//     async createStudent(studentData: IStudent): Promise<IStudent> {
//         const student = Student.build(studentData)
//         return await student.save();
//     }
//     async findStudentByEmail(email: string): Promise<IStudent | null> {
//         return await Student.findOne({ email })
//     }
//     async findStudentById(studentId: string): Promise<IStudent | null> {
//         const student= await Student.findById(studentId)
//         if(!student){
//             throw new BadRequestError('Invalid Id')
//         }
//         return student;
//     }
//     async updateUserVerification(email: string): Promise<IStudent> {
//         const student = await Student.findOne({ email });
//         student!.set({ isVerified: true });
//         return await student!.save();
//     }
//     async updateStudent(studentData:IStudent): Promise<IStudent>{
//         const {id,name,mobile} = studentData;
//         const student = await Student.findById(id)
//         if(!student){
//             throw new BadRequestError('Student not found')
//         }
//         student.set({
//             name,
//             mobile
//         })
//         return await student.save()
//     }
//     async updateImage(studentId:string,image:string):Promise<IStudent>{
//         const student = await Student.findById(studentId)
//         if(!student){
//             throw new BadRequestError('Invalid Id')
//         }
//         student.set({
//             image,
//         })
//         return await student.save()
//     }
//     async udpatePassword(studentId: string, password: string): Promise<IStudent> {
//         const student = await Student.findById(studentId);
//         if (!student) {
//           throw new BadRequestError("Id not valid");
//         }
//         student.set({
//           password,
//         });
//         return await student.save();
//       }
//       async courseEnroll(studentId: string, courseId: string): Promise<IStudent> {
//           const student = await Student.findById(studentId)
//           if(!student){
//             throw new BadRequestError('Student not found')
//           }
//           student.courses?.push(courseId)
//           return await student.save()
//       }
//       async getAllStudents(): Promise<IStudent[] | null> {
//         return await Student.find();
//       }
//       async blockStudent(studentId: string): Promise<IStudent> {
//         const student = await Student.findOne({ _id: studentId });
//         student!.set({ isBlocked: true });
//         return await student!.save();
//       }
//       async unblockStudent(studentId: string): Promise<IStudent> {
//         const student = await Student.findOne({ _id: studentId });
//         student!.set({ isBlocked: false });
//         return await student!.save();
//       }
//       async getStudentCount(): Promise<number> {
//         return await Student.countDocuments();
//       }
// }
