import express, { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { isUserAuth } from "../middlewares/currentUser";
import { AdminRepository, CategoryRepository, StudentRepository, InstructorRepository, CourseRepository, EnrolledCourseRepository } from "../repositories";
import { AdminService } from "../services/adminService";

const adminRouter: Router = express.Router();

const adminRepository = new AdminRepository();
const categoryRepository = new CategoryRepository();
const studentRepository = new StudentRepository();
const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const enrolledCourseRepository = new EnrolledCourseRepository();

const adminService = new AdminService(
  adminRepository,
  categoryRepository,
  studentRepository,
  instructorRepository,
  courseRepository,
  enrolledCourseRepository
);

const adminController = new AdminController(adminService);

// Auth & Login
adminRouter.post('/login', (req, res, next) => adminController.login(req, res, next));

// Category Management
adminRouter.get("/categories", isUserAuth, (req, res, next) => adminController.getAllCategories(req, res, next));
adminRouter.post('/addCategory', (req, res, next) => adminController.addCategory(req, res, next));
adminRouter.put("/category", isUserAuth, (req, res, next) => adminController.editCategory(req, res, next));
adminRouter.patch("/listCategory", isUserAuth, (req, res, next) => adminController.listCategory(req, res, next));
adminRouter.patch("/unlistCategory", isUserAuth, (req, res, next) => adminController.unlistCategory(req, res, next));

// User Management: Students
adminRouter.get("/getStudents", isUserAuth, (req, res, next) => adminController.getAllStudents(req, res, next));
adminRouter.patch("/blockStudent", isUserAuth, (req, res, next) => adminController.blockStudent(req, res, next));
adminRouter.patch("/unblockStudent", isUserAuth, (req, res, next) => adminController.unblockStudent(req, res, next));

// User Management: Instructors
adminRouter.get("/getInstructors", isUserAuth, (req, res, next) => adminController.getAllInstructors(req, res, next));
adminRouter.patch("/blockInstructor", isUserAuth, (req, res, next) => adminController.blockInstructor(req, res, next));
adminRouter.patch("/unblockInstructor", isUserAuth, (req, res, next) => adminController.unblockInstructor(req, res, next));


// Course Management
adminRouter.get('/courses', isUserAuth, (req, res, next) => adminController.getCoursesByAdmin(req, res, next));
adminRouter.patch("/courseApproval", isUserAuth, (req, res, next) => adminController.approveCourse(req, res, next));
adminRouter.get("/course/:courseId", isUserAuth, (req, res, next) => adminController.getSingleCourse(req, res, next));
adminRouter.get('/enrolledCourses', isUserAuth, (req, res, next) => adminController.getEnrolledCoursesByAdmin(req, res, next));

// Dashboard and Analytics
adminRouter.get('/dashboard', isUserAuth, (req, res, next) => adminController.adminDashBoard(req, res, next));
adminRouter.get('/salesData', isUserAuth, (req, res, next) => adminController.getRevenueChartData(req, res, next));

export default adminRouter;
