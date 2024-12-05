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
exports.EnrolledCourseRepository = void 0;
const enrolledCourse_1 = require("../models/enrolledCourse");
const badrequestError_1 = require("../constants/errors/badrequestError");
class EnrolledCourseRepository {
    createCourse(courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollCourse = enrolledCourse_1.EnrolledCourse.build(courseDetails);
            return yield enrollCourse.save();
        });
    }
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolledCourse = yield enrolledCourse_1.EnrolledCourse.findById(courseId).populate({
                path: "courseId",
                populate: {
                    path: "modules.module",
                    model: "module",
                },
            });
            if (!enrolledCourse) {
                throw new badrequestError_1.BadRequestError("Course not found");
            }
            return enrolledCourse;
        });
    }
    getCourseByStudentIdAndCourseId(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield enrolledCourse_1.EnrolledCourse.findOne({
                studentId,
                courseId,
            }).populate({
                path: "courseId",
                populate: {
                    path: "modules.module",
                    model: "module",
                },
            });
            return result;
        });
    }
    getEnrolledCoursesByStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolledCourses = enrolledCourse_1.EnrolledCourse.find({ studentId }).populate({
                path: "courseId",
                populate: [
                    { path: "modules.module", model: "module" },
                    { path: "category", model: "category" },
                    { path: "instructor", model: "instructor", select: "name" },
                ],
            });
            if (!enrolledCourses) {
                throw new badrequestError_1.BadRequestError("Enrollment not found");
            }
            return enrolledCourses;
        });
    }
    getEnrolledCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolledCourses = yield enrolledCourse_1.EnrolledCourse.find({})
                .populate({
                path: "courseId",
                match: { instructor: instructorId },
                populate: [
                    { path: "modules.module", model: "module" },
                    { path: "category", model: "category" },
                    { path: "instructor", model: "instructor" },
                ],
            })
                .populate("studentId")
                .sort({ createdAt: -1 });
            const filteredEnrolledCourses = enrolledCourses.filter((enrolledCourse) => enrolledCourse.courseId !== null);
            if (!filteredEnrolledCourses.length) {
                throw new Error("No enrolled courses found for this instructor.");
            }
            return filteredEnrolledCourses;
        });
    }
    getEnrolledCoursesByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield enrolledCourse_1.EnrolledCourse.find({ courseId }).populate("studentId");
        });
    }
    checkEnrolledCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield enrolledCourse_1.EnrolledCourse.findOne({ studentId, courseId });
        });
    }
    addModuleToProgression(enrollmentId, chapterTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const course = yield enrolledCourse_1.EnrolledCourse.findById(enrollmentId);
            if (!course) {
                throw new badrequestError_1.BadRequestError("Enrollment not found");
            }
            if (!((_a = course.progression) === null || _a === void 0 ? void 0 : _a.includes(chapterTitle))) {
                (_b = course.progression) === null || _b === void 0 ? void 0 : _b.push(chapterTitle);
            }
            const updatedCourse = yield course.save();
            return updatedCourse;
        });
    }
    completedStatus(enrolledId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield enrolledCourse_1.EnrolledCourse.findById(enrolledId);
            if (course) {
                course.set({ completed: true });
            }
            yield (course === null || course === void 0 ? void 0 : course.save());
        });
    }
    getEnrolledCoursesByAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolledCourses = yield enrolledCourse_1.EnrolledCourse.find({})
                .populate({
                path: "courseId",
                populate: [
                    { path: "modules.module", model: "module" },
                    { path: "category", model: "category" },
                    { path: "instructor", model: "instructor" },
                ],
            })
                .populate("studentId")
                .sort({ createdAt: -1 });
            if (!enrolledCourses.length) {
                throw new Error("No enrolled courses found.");
            }
            return enrolledCourses;
        });
    }
    getTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield enrolledCourse_1.EnrolledCourse.aggregate([
                {
                    $match: {
                        status: true,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$price" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalRevenue: 1,
                    },
                },
            ]);
            return result.length > 0 ? result[0].totalRevenue : 0;
        });
    }
    getRevenueData(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            let startDate, groupFormat;
            switch (filter) {
                case "weekly":
                    startDate = new Date(date.setDate(date.getDate() - 7));
                    groupFormat = {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    };
                    break;
                case "monthly":
                    startDate = new Date(date.setMonth(date.getMonth() - 12));
                    groupFormat = { $month: "$createdAt" };
                    break;
                case "yearly":
                    startDate = new Date(date.setFullYear(date.getFullYear() - 5));
                    groupFormat = { $year: "$createdAt" };
                    break;
                default:
                    throw new Error("Invalid filter type");
            }
            const revenueData = yield enrolledCourse_1.EnrolledCourse.aggregate([
                {
                    $match: {
                        status: true,
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: groupFormat,
                        totalRevenue: { $sum: "$price" },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $project: {
                        _id: 1,
                        totalRevenue: 1,
                    },
                },
            ]);
            return revenueData;
        });
    }
}
exports.EnrolledCourseRepository = EnrolledCourseRepository;
