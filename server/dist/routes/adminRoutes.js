"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const currentUser_1 = require("../middlewares/currentUser");
const repositories_1 = require("../repositories");
const adminService_1 = require("../services/adminService");
const adminRouter = express_1.default.Router();
const adminRepository = new repositories_1.AdminRepository();
const categoryRepository = new repositories_1.CategoryRepository();
const studentRepository = new repositories_1.StudentRepository();
const instructorRepository = new repositories_1.InstructorRepository();
const courseRepository = new repositories_1.CourseRepository();
const enrolledCourseRepository = new repositories_1.EnrolledCourseRepository();
const adminService = new adminService_1.AdminService(adminRepository, categoryRepository, studentRepository, instructorRepository, courseRepository, enrolledCourseRepository);
const adminController = new adminController_1.AdminController(adminService);
// Auth & Login
adminRouter.post('/login', (req, res, next) => adminController.login(req, res, next));
// Category Management
adminRouter.get("/categories", currentUser_1.isUserAuth, (req, res, next) => adminController.getAllCategories(req, res, next));
adminRouter.post('/addCategory', (req, res, next) => adminController.addCategory(req, res, next));
adminRouter.put("/category", currentUser_1.isUserAuth, (req, res, next) => adminController.editCategory(req, res, next));
adminRouter.patch("/listCategory", currentUser_1.isUserAuth, (req, res, next) => adminController.listCategory(req, res, next));
adminRouter.patch("/unlistCategory", currentUser_1.isUserAuth, (req, res, next) => adminController.unlistCategory(req, res, next));
// User Management: Students
adminRouter.get("/getStudents", currentUser_1.isUserAuth, (req, res, next) => adminController.getAllStudents(req, res, next));
adminRouter.patch("/blockStudent", currentUser_1.isUserAuth, (req, res, next) => adminController.blockStudent(req, res, next));
adminRouter.patch("/unblockStudent", currentUser_1.isUserAuth, (req, res, next) => adminController.unblockStudent(req, res, next));
// User Management: Instructors
adminRouter.get("/getInstructors", currentUser_1.isUserAuth, (req, res, next) => adminController.getAllInstructors(req, res, next));
adminRouter.patch("/blockInstructor", currentUser_1.isUserAuth, (req, res, next) => adminController.blockInstructor(req, res, next));
adminRouter.patch("/unblockInstructor", currentUser_1.isUserAuth, (req, res, next) => adminController.unblockInstructor(req, res, next));
// Course Management
adminRouter.get('/courses', currentUser_1.isUserAuth, (req, res, next) => adminController.getCoursesByAdmin(req, res, next));
adminRouter.patch("/courseApproval", currentUser_1.isUserAuth, (req, res, next) => adminController.approveCourse(req, res, next));
adminRouter.get("/course/:courseId", currentUser_1.isUserAuth, (req, res, next) => adminController.getSingleCourse(req, res, next));
adminRouter.get('/enrolledCourses', currentUser_1.isUserAuth, (req, res, next) => adminController.getEnrolledCoursesByAdmin(req, res, next));
// Dashboard and Analytics
adminRouter.get('/dashboard', currentUser_1.isUserAuth, (req, res, next) => adminController.adminDashBoard(req, res, next));
adminRouter.get('/salesData', currentUser_1.isUserAuth, (req, res, next) => adminController.getRevenueChartData(req, res, next));
exports.default = adminRouter;
