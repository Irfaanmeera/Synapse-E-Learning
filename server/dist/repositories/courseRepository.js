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
exports.CourseRepository = void 0;
/* eslint-disable react/no-is-mounted */
const baseRepository_1 = require("./baseRepository"); // Assuming the BaseRepository file path
const ICourse_1 = require("../interfaces/entityInterface/ICourse");
const notFoundError_1 = require("../constants/errors/notFoundError");
const courseModel_1 = require("../models/courseModel");
const instructorModel_1 = require("../models/instructorModel");
class CourseRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(courseModel_1.Course);
    }
    createCourse(courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.create(courseDetails);
            const instructorId = courseDetails.instructor;
            if (instructorId) {
                yield instructorModel_1.Instructor.findByIdAndUpdate(instructorId, {
                    $push: { courses: course.name },
                });
            }
            return course;
        });
    }
    getAllCourses(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const LIMIT = 10;
            const skip = (page - 1) * LIMIT;
            const courses = yield this.model
                .find()
                .skip(skip)
                .limit(LIMIT)
                .populate("category")
                .populate("level");
            const totalCount = yield this.count();
            return { courses, totalCount };
        });
    }
    getCourseByInstructor(instructorId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const LIMIT = 8;
            const skip = (page - 1) * LIMIT;
            const courses = yield this.model
                .find({ instructor: instructorId })
                .skip(skip)
                .limit(LIMIT)
                .populate("category")
                .populate("level");
            const totalCount = yield this.count({ instructor: instructorId });
            return { courses, totalCount };
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            return course;
        });
    }
    getSingleCourseForInstructor(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findById(courseId)
                .populate("instructor")
                .populate("category")
                .populate({
                path: "modules.module",
                model: "module",
            });
        });
    }
    getCoursesByApproval(approval) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll({ approval });
        });
    }
    updateCourse(courseId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCourse = yield this.updateById(courseId, courseDetails);
            if (!updatedCourse) {
                throw new Error("Course not found");
            }
            return updatedCourse;
        });
    }
    addModule(courseId, module) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const course = yield this.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            (_a = course.modules) === null || _a === void 0 ? void 0 : _a.push(module);
            const updatedCourse = yield this.updateById(courseId, { modules: course.modules });
            if (!updatedCourse) {
                throw new Error("Failed to update course modules");
            }
            return updatedCourse;
        });
    }
    getCoursesByCategory(categoryId_1) {
        return __awaiter(this, arguments, void 0, function* (categoryId, page = 1, limit = 10) {
            const filter = { category: categoryId, approval: "Approved", status: true };
            const skip = (page - 1) * limit;
            const total = yield courseModel_1.Course.countDocuments(filter);
            const courses = yield courseModel_1.Course.find(filter)
                .populate("category", "name")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            return { courses, total };
        });
    }
    courseApproval(courseId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.updateById(courseId, { approval: status });
            if (!course) {
                throw new Error("Course not found"); // Handle the case where the course does not exist
            }
            return course;
        });
    }
    addCourseImage(courseId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.updateById(courseId, { image });
            if (!course) {
                throw new Error("Course not found");
            }
            return course;
        });
    }
    listCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.updateById(courseId, { status: true });
            if (!course) {
                throw new Error("Course not found");
            }
            return course;
        });
    }
    unlistCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.updateById(courseId, { status: false });
            if (!course) {
                throw new Error("Course not found");
            }
            return course;
        });
    }
    getListedCourses(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, category, }) {
            const condition = {
                status: true,
                approval: ICourse_1.CourseApproval.approved,
            };
            if (category) {
                condition.category = category;
            }
            const LIMIT = 8;
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * LIMIT;
            }
            const courses = yield courseModel_1.Course.find(condition)
                .limit(LIMIT)
                .skip(skip)
                .populate("category")
                .populate("level")
                .sort({ createdAt: -1 });
            const totalCount = yield courseModel_1.Course.find(condition).countDocuments();
            return { courses, totalCount };
        });
    }
    incrementEnrolledCount(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
        });
    }
    getCourseByAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .find()
                .populate("instructor")
                .populate("category")
                .populate({
                path: "modules.module",
                model: "module",
            });
        });
    }
    getSingleCourseForAdmin(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findById(courseId)
                .populate("instructor")
                .populate("category")
                .populate({
                path: "modules.module",
                model: "module",
            });
        });
    }
    getCourseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.count({ approval: ICourse_1.CourseApproval.approved });
        });
    }
    searchCoursesForStudents(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.Course.find(Object.assign({ approval: "Approved" }, details));
            return course;
        });
    }
}
exports.CourseRepository = CourseRepository;
// import { Course } from "../models/courseModel";
// import {
//   ICourse,
//   CourseApproval,
//   ISearch,
// } from "../interfaces/entityInterface/ICourse";
// import { ICourseRepository } from "../interfaces/repositoryInterfaces/ICourseRepository";
// import { NotFoundError } from "../constants/errors/notFoundError";
// import { Instructor } from "../models/instructorModel";
// export class CourseRepository implements ICourseRepository {
//   async createCourse(courseDetails: ICourse): Promise<ICourse> {
//     const course = Course.build(courseDetails);
//     const savedCourse = await course.save();
//     const instructorId = courseDetails.instructor;
//     if (instructorId) {
//       await Instructor.findByIdAndUpdate(instructorId, {
//         $push: { courses: savedCourse.name },
//       });
//     }
//     return savedCourse;
//   }
//   async getAllCourses(page: number): Promise<{
//     courses: ICourse[];
//     totalCount: number;
//   } | null> {
//     const LIMIT = 10;
//     let skip = 0;
//     if (page > 1) {
//       skip = (page - 1) * LIMIT;
//     }
//     const courses = await Course.find()
//       .skip(skip)
//       .limit(LIMIT)
//       .populate("category")
//       .populate("level");
//     const totalCount = await Course.find().countDocuments();
//     return { courses, totalCount };
//   }
//   async getCourseByInstructor(
//     instructorId: string,
//     page: number
//   ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
//     const LIMIT = 8;
//     let skip = 0;
//     if (page > 1) {
//       skip = (page - 1) * LIMIT;
//     }
//     const courses = await Course.find({ instructor: instructorId })
//       .skip(skip)
//       .limit(LIMIT)
//       .populate("category")
//       .populate("level");
//     const totalCount = await Course.find({
//       instructor: instructorId,
//     }).countDocuments();
//     return { courses, totalCount };
//   }
//   async getSingleCourseForInstructor(
//     courseId: string
//   ): Promise<ICourse | null> {
//     return await Course.findById(courseId)
//       .populate("instructor")
//       .populate("category")
//       .populate({
//         path: "modules.module",
//         model: "module",
//       });
//   }
//   async getCoursesByApproval(
//     approval: CourseApproval
//   ): Promise<ICourse[] | null> {
//     return await Course.find({ approval });
//   }
//   async findCourseById(courseId: string): Promise<ICourse | null> {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new NotFoundError("Course not found");
//     }
//     return course;
//   }
//   async updateCourse(
//     courseId: string,
//     courseDetails: ICourse
//   ): Promise<ICourse> {
//     const { name, category, description, price, image, level } = courseDetails;
//     const course = await Course.findById(courseId);
//     course!.set({
//       name,
//       category,
//       description,
//       image,
//       price,
//       level,
//     });
//     return await course!.save();
//   }
//   async addModule(
//     courseId: string,
//     module: { module: string; order: number }
//   ): Promise<ICourse> {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new NotFoundError("Course not found");
//     }
//     course?.modules?.push(module);
//     return await course.save();
//   }
//   async getCoursesByCategory(
//     categoryId: string,
//     page: number = 1,
//     limit: number = 10
//   ): Promise<{ courses: ICourse[]; total: number }> {
//     const filter = { category: categoryId, approval: "Approved", status: true };
//     const skip = (page - 1) * limit;
//     const total = await Course.countDocuments(filter);
//     const courses = await Course.find(filter)
//       .populate("category", "name")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });
//     return { courses, total };
//   }
//   async courseApproval(
//     courseId: string,
//     status: CourseApproval
//   ): Promise<ICourse> {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new NotFoundError("Course not found");
//     }
//     course.set({
//       approval: status,
//     });
//     return await course.save();
//   }
//   async addCourseImage(courseId: string, image: string): Promise<ICourse> {
//     const course = await Course.findById(courseId);
//     course!.set({
//       image,
//     });
//     return await course!.save();
//   }
//   async getCourseCount(): Promise<number> {
//     return await Course.countDocuments({ approval: CourseApproval.approved });
//   }
//   async listCourse(courseId: string): Promise<ICourse> {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new NotFoundError("Course not found");
//     }
//     course.set({
//       status: true,
//     });
//     return await course.save();
//   }
//   async unlistCourse(courseId: string): Promise<ICourse> {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new NotFoundError("Course not found");
//     }
//     course.set({
//       status: false,
//     });
//     return await course.save();
//   }
//   async getListedCourses({
//     page,
//     category,
//   }: {
//     page: number;
//     category?: string;
//   }): Promise<{
//     courses: ICourse[];
//     totalCount: number;
//   } | null> {
//     const condition: { category?: string; status: boolean; approval: string } =
//       {
//         status: true,
//         approval: CourseApproval.approved,
//       };
//     if (category) {
//       condition.category = category;
//     }
//     const LIMIT = 8;
//     let skip = 0;
//     if (page > 1) {
//       skip = (page - 1) * LIMIT;
//     }
//     const courses = await Course.find(condition)
//       .limit(LIMIT)
//       .skip(skip)
//       .populate("category")
//       .populate("level")
//       .sort({ createdAt: -1 });
//     const totalCount = await Course.find(condition).countDocuments();
//     return { courses, totalCount };
//   }
//   async incrementEnrolledCount(courseId: string): Promise<void> {
//     await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
//   }
//   async getCourseByAdmin(): Promise<ICourse[]> {
//     return await Course.find()
//       .populate("instructor")
//       .populate("category")
//       .populate({
//         path: "modules.module",
//         model: "module",
//       });
//   }
//   async getSingleCourseForAdmin(courseId: string): Promise<ICourse | null> {
//     const course = await Course.findById(courseId)
//       .populate("instructor")
//       .populate("category")
//       .populate({
//         path: "modules.module",
//         model: "module",
//       });
//     return course;
//   }
//   async searchCoursesForStudents(details: ISearch): Promise<ICourse[] | null> {
//     const course = await Course.find({ approval: "Approved", ...details });
//     return course;
//   }
// }
