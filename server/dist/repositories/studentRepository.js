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
const studentModel_1 = require("../models/studentModel");
const badrequestError_1 = require("../constants/errors/badrequestError");
class StudentRepository {
    createStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = studentModel_1.Student.build(studentData);
            return yield student.save();
        });
    }
    findStudentByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.Student.findOne({ email });
        });
    }
    findStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError('Invalid Id');
            }
            return student;
        });
    }
    updateUserVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findOne({ email });
            student.set({ isVerified: true });
            return yield student.save();
        });
    }
    updateStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, mobile } = studentData;
            const student = yield studentModel_1.Student.findById(id);
            if (!student) {
                throw new badrequestError_1.BadRequestError('Student not found');
            }
            student.set({
                name,
                mobile
            });
            return yield student.save();
        });
    }
    updateImage(studentId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError('Invalid Id');
            }
            student.set({
                image,
            });
            return yield student.save();
        });
    }
    udpatePassword(studentId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError("Id not valid");
            }
            student.set({
                password,
            });
            return yield student.save();
        });
    }
    courseEnroll(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const student = yield studentModel_1.Student.findById(studentId);
            if (!student) {
                throw new badrequestError_1.BadRequestError('Student not found');
            }
            (_a = student.courses) === null || _a === void 0 ? void 0 : _a.push(courseId);
            return yield student.save();
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.Student.find();
        });
    }
    blockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findOne({ _id: studentId });
            student.set({ isBlocked: true });
            return yield student.save();
        });
    }
    unblockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield studentModel_1.Student.findOne({ _id: studentId });
            student.set({ isBlocked: false });
            return yield student.save();
        });
    }
    getStudentCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.Student.countDocuments();
        });
    }
}
exports.StudentRepository = StudentRepository;
