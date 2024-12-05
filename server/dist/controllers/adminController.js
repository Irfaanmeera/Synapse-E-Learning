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
exports.AdminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const badrequestError_1 = require("../constants/errors/badrequestError");
const generateJWT_1 = require("../utils/generateJWT");
const IUserRoles_1 = __importDefault(require("../interfaces/entityInterface/IUserRoles"));
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this.adminService.login(email);
                const isPasswordMatch = yield bcryptjs_1.default.compare(password, admin.password);
                if (!admin || !admin.id) {
                    throw new Error("Admin or admin id not found");
                }
                if (isPasswordMatch) {
                    const token = (0, generateJWT_1.generateToken)(admin.id, IUserRoles_1.default.Admin, process.env.JWT_SECRET, "1h");
                    const refreshToken = (0, generateJWT_1.generateToken)(admin.id, IUserRoles_1.default.Admin, process.env.JWT_REFRESH_SECRET, "7d");
                    const adminDetails = {
                        _id: admin.id,
                        email: admin.email,
                        role: "admin",
                    };
                    res.status(200).json({
                        admin: adminDetails,
                        message: "Admin signed in",
                        token,
                        refreshToken,
                        success: true,
                    });
                }
                else {
                    res.status(400).json({ message: "Incorrect Password" });
                    throw new badrequestError_1.BadRequestError("Incorrect password");
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
                else {
                    console.log("An unknown error occurred");
                }
            }
        });
    }
    getAllCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.adminService.getAllCategories();
                res.status(200).json({ categories });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    addCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = req.body;
                const newCategory = yield this.adminService.addCategory(category);
                res.status(201).json({ category: newCategory });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    editCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, data } = req.body;
                const updatedCaetgory = yield this.adminService.editCategory(categoryId, data);
                res.status(200).json({ category: updatedCaetgory });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    listCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.body;
                const listedCategory = yield this.adminService.listCategory(categoryId);
                res.status(200).json({ category: listedCategory, success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    unlistCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.body;
                const unlistedCategory = yield this.adminService.unlistCategory(categoryId);
                res.status(200).json({ category: unlistedCategory, success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getAllStudents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield this.adminService.getAllStudents();
                res.status(200).json({ students });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getAllInstructors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructors = yield this.adminService.getAllInstructors();
                res.status(200).json({ instructors });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    blockInstructor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { instructorId } = req.body;
                if (!instructorId) {
                    throw new badrequestError_1.BadRequestError("Invalid Id");
                }
                yield this.adminService.blockInstructor(instructorId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    unblockInstructor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { instructorId } = req.body;
                if (!instructorId) {
                    throw new badrequestError_1.BadRequestError("Invalid Id");
                }
                yield this.adminService.unblockInstructor(instructorId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    blockStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.body;
                if (!studentId) {
                    throw new badrequestError_1.BadRequestError("Invalid Id");
                }
                yield this.adminService.blockStudent(studentId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    unblockStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.body;
                if (!studentId) {
                    throw new badrequestError_1.BadRequestError("Invalid Id");
                }
                yield this.adminService.unblockStudent(studentId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getCoursesByAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.adminService.getAllCourses();
                res.status(200).json({ success: true, data: courses });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    approveCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, approval } = req.body;
                const updatedCourse = yield this.adminService.courseApproval(courseId, approval);
                res.status(200).json(updatedCourse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSingleCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield this.adminService.getSingleCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    adminDashBoard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.adminService.adminDashboardData();
                res.status(200).json(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getEnrolledCoursesByAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this.adminService.getEnrolledCoursesByAdmin();
                res.status(201).json(enrolledCourses);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    next(error);
                }
            }
        });
    }
    getRevenueChartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.query;
                if (!filter) {
                    return res.status(400).json({ message: "Filter is required" });
                }
                const revenueData = yield this.adminService.fetchSalesData(filter);
                res.status(200).json(revenueData);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
}
exports.AdminController = AdminController;
