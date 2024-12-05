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
const courseModel_1 = require("../models/courseModel");
const ICourse_1 = require("../interfaces/entityInterface/ICourse");
const notFoundError_1 = require("../constants/errors/notFoundError");
const instructorModel_1 = require("../models/instructorModel");
class CourseRepository {
    createCourse(courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courseModel_1.Course.build(courseDetails);
            const savedCourse = yield course.save();
            const instructorId = courseDetails.instructor;
            if (instructorId) {
                yield instructorModel_1.Instructor.findByIdAndUpdate(instructorId, {
                    $push: { courses: savedCourse.name },
                });
            }
            return savedCourse;
        });
    }
    getAllCourses(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const LIMIT = 10;
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * LIMIT;
            }
            const courses = yield courseModel_1.Course.find()
                .skip(skip)
                .limit(LIMIT)
                .populate("category")
                .populate("level");
            const totalCount = yield courseModel_1.Course.find().countDocuments();
            return { courses, totalCount };
        });
    }
    getCourseByInstructor(instructorId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const LIMIT = 8;
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * LIMIT;
            }
            const courses = yield courseModel_1.Course.find({ instructor: instructorId })
                .skip(skip)
                .limit(LIMIT)
                .populate("category")
                .populate("level");
            const totalCount = yield courseModel_1.Course.find({
                instructor: instructorId,
            }).countDocuments();
            return { courses, totalCount };
        });
    }
    getSingleCourseForInstructor(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield courseModel_1.Course.findById(courseId)
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
            return yield courseModel_1.Course.find({ approval });
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.Course.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            return course;
        });
    }
    updateCourse(courseId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, category, description, price, image, level } = courseDetails;
            const course = yield courseModel_1.Course.findById(courseId);
            course.set({
                name,
                category,
                description,
                image,
                price,
                level,
            });
            return yield course.save();
        });
    }
    addModule(courseId, module) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const course = yield courseModel_1.Course.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            (_a = course === null || course === void 0 ? void 0 : course.modules) === null || _a === void 0 ? void 0 : _a.push(module);
            return yield course.save();
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
            const course = yield courseModel_1.Course.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            course.set({
                approval: status,
            });
            return yield course.save();
        });
    }
    addCourseImage(courseId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.Course.findById(courseId);
            course.set({
                image,
            });
            return yield course.save();
        });
    }
    getCourseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield courseModel_1.Course.countDocuments({ approval: ICourse_1.CourseApproval.approved });
        });
    }
    listCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.Course.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            course.set({
                status: true,
            });
            return yield course.save();
        });
    }
    unlistCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.Course.findById(courseId);
            if (!course) {
                throw new notFoundError_1.NotFoundError("Course not found");
            }
            course.set({
                status: false,
            });
            return yield course.save();
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
            yield courseModel_1.Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
        });
    }
    getCourseByAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield courseModel_1.Course.find()
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
            const course = yield courseModel_1.Course.findById(courseId)
                .populate("instructor")
                .populate("category")
                .populate({
                path: "modules.module",
                model: "module",
            });
            return course;
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
