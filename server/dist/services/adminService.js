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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const badrequestError_1 = require("../constants/errors/badrequestError");
class AdminService {
    constructor(adminRepository, categoryRepository, studentRepository, instructorRepository, courseRepository, enrolledCourseRepository) {
        this.adminRepository = adminRepository;
        this.categoryRepository = categoryRepository;
        this.studentRepository = studentRepository;
        this.instructorRepository = instructorRepository;
        this.courseRepository = courseRepository;
        this.enrolledCourseRepository = enrolledCourseRepository;
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminRepository.findAdminByEmail(email);
                if (!admin) {
                    throw new ErrorHandler_1.default("Admin Not Found", httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                return admin;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error logging in", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.getAllCategories();
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching categories", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    addCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield this.categoryRepository.findCategoryByName(category)) {
                    throw new badrequestError_1.BadRequestError("Category already exists");
                }
                return yield this.categoryRepository.createCategory(category);
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error adding category", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    editCategory(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.updateCategory(categoryId, data.category);
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error editing category", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    listCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.listCategory(categoryId);
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error listing category", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    unlistCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.unlistCategory(categoryId);
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error unlisting category", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.getAllStudents();
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching students", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.instructorRepository.getAllInstructors();
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching instructors", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    blockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this.studentRepository.blockStudent(studentId);
                if (!student) {
                    throw new ErrorHandler_1.default("Student not found", httpStatusCodes_1.STATUS_CODES.NOT_FOUND);
                }
                return student;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error blocking student", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    unblockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this.studentRepository.unblockStudent(studentId);
                if (!student) {
                    throw new ErrorHandler_1.default("Student not found", httpStatusCodes_1.STATUS_CODES.NOT_FOUND);
                }
                return student;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error unblocking student", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    blockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this.instructorRepository.blockInstructor(instructorId);
                if (!instructor) {
                    throw new ErrorHandler_1.default("Instructor not found", httpStatusCodes_1.STATUS_CODES.NOT_FOUND);
                }
                return instructor;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error blocking instructor", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    unblockInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this.instructorRepository.unblockInstructor(instructorId);
                if (!instructor) {
                    throw new ErrorHandler_1.default("Instructor not found", httpStatusCodes_1.STATUS_CODES.NOT_FOUND);
                }
                return instructor;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error unblocking instructor", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.courseRepository.getCourseByAdmin();
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching courses", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.getSingleCourseForAdmin(courseId);
                if (!course) {
                    throw new badrequestError_1.BadRequestError("Course not found");
                }
                return course;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching course", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    courseApproval(courseId, approval) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.courseRepository.courseApproval(courseId, approval);
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error approving course", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    adminDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalRevenue = yield this.enrolledCourseRepository.getTotalRevenue();
                const instructorCount = yield this.instructorRepository.getInstructorCount();
                const studentCount = yield this.studentRepository.getStudentCount();
                const courseCount = yield this.courseRepository.getCourseCount();
                return { totalRevenue, instructorCount, studentCount, courseCount };
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching dashboard data", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getEnrolledCoursesByAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this.enrolledCourseRepository.getEnrolledCoursesByAdmin();
                if (!enrolledCourses) {
                    throw new badrequestError_1.BadRequestError("No enrollment");
                }
                return enrolledCourses;
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching enrolled courses", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
    fetchSalesData(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salesData = yield this.enrolledCourseRepository.getRevenueData(filter);
                return { data: salesData };
            }
            catch (error) {
                console.error(error);
                throw new ErrorHandler_1.default("Error fetching sales data", httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.AdminService = AdminService;
