"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const currentUser_1 = require("../middlewares/currentUser");
const multer_1 = require("../middlewares/multer");
const repositories_1 = require("../repositories");
const studentService_1 = require("../services/studentService");
const otpService_1 = require("../services/otpService");
const studentRouter = express_1.default.Router();
const studentRepository = new repositories_1.StudentRepository();
const instructorRepository = new repositories_1.InstructorRepository();
const courseRepository = new repositories_1.CourseRepository();
const categoryRepository = new repositories_1.CategoryRepository();
const enrolledCourseRepository = new repositories_1.EnrolledCourseRepository();
const moduleRepository = new repositories_1.ModuleRepository();
const otpRepository = new repositories_1.OtpRepository();
const otpService = new otpService_1.OtpService(otpRepository);
const studentService = new studentService_1.StudentService(studentRepository, instructorRepository, courseRepository, categoryRepository, moduleRepository, enrolledCourseRepository);
const studentController = new studentController_1.StudentController(studentService, otpService);
/* Authentication Routes */
studentRouter.post('/signup', (req, res, next) => studentController.signup(req, res, next));
studentRouter.post('/resendOtp', (req, res) => studentController.resendOtp(req, res));
studentRouter.post('/verifyOtp', (req, res) => studentController.verifyOtp(req, res));
studentRouter.post('/login', (req, res, next) => studentController.login(req, res, next));
studentRouter.post('/google-login', (req, res, next) => studentController.googleLogin(req, res, next));
studentRouter.post('/verify-forgot-password-otp', (req, res, next) => studentController.forgotPasswordOtpVerification(req, res, next));
studentRouter.post('/forgot-password', (req, res, next) => studentController.resetForgottedPassword(req, res, next));
/* User Profile Routes */
studentRouter.put('/updateUser', currentUser_1.isUserAuth, (req, res, next) => studentController.updateUser(req, res, next));
studentRouter.put('/updateImage', currentUser_1.isUserAuth, multer_1.upload.single('image'), (req, res, next) => studentController.updateImage(req, res, next));
/* Courses and Categories Routes */
studentRouter.get('/courses', (req, res, next) => studentController.getAllCourses(req, res, next));
studentRouter.get("/searchCourse", (req, res, next) => studentController.searchCourses(req, res, next));
studentRouter.get('/coursesByCategory', (req, res, next) => studentController.getCoursesByCategoryId(req, res, next));
studentRouter.get('/categories', (req, res, next) => studentController.getAllCategories(req, res, next));
studentRouter.get('/course/:courseId', (req, res, next) => studentController.getSingleCourse(req, res, next));
/* Enrollment and Progression Routes */
studentRouter.post('/createPayment', currentUser_1.isUserAuth, (req, res, next) => studentController.stripePaymentIntent(req, res, next));
studentRouter.post('/enrollCourse', currentUser_1.isUserAuth, (req, res, next) => studentController.enrollCourse(req, res, next));
studentRouter.get('/getEnrolledCourse/:courseId', currentUser_1.isUserAuth, (req, res, next) => studentController.getEnrolledCourseByStudent(req, res, next));
studentRouter.get('/getEnrolledCoursesByStudent', currentUser_1.isUserAuth, (req, res, next) => studentController.getEnrolledCoursesByStudent(req, res, next));
studentRouter.get('/addProgression', currentUser_1.isUserAuth, (req, res, next) => studentController.addProgression(req, res, next));
studentRouter.get('/totalChapterCount/:courseId', (req, res, next) => studentController.getTotalChapterCountByCourseId(req, res, next));
exports.default = studentRouter;
