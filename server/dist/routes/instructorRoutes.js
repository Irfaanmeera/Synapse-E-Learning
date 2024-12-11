"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const instructorController_1 = require("../controllers/instructorController");
const currentUser_1 = require("../middlewares/currentUser");
const multer_1 = require("../middlewares/multer");
const repositories_1 = require("../repositories");
const instructorService_1 = require("../services/instructorService");
const otpService_1 = require("../services/otpService");
const instructorRouter = express_1.default.Router();
const instructorRepository = new repositories_1.InstructorRepository();
const courseRepository = new repositories_1.CourseRepository();
const categoryRepository = new repositories_1.CategoryRepository();
const moduleRepository = new repositories_1.ModuleRepository();
const enrolledCourseRepository = new repositories_1.EnrolledCourseRepository();
const otpRepository = new repositories_1.OtpRepository();
const otpService = new otpService_1.OtpService(otpRepository);
const instructorService = new instructorService_1.InstructorService(instructorRepository, courseRepository, categoryRepository, moduleRepository, enrolledCourseRepository);
const instructorController = new instructorController_1.InstructorController(instructorService, otpService);
/* Authentication Routes */
instructorRouter.post('/signup', (req, res, next) => instructorController.signup(req, res, next));
instructorRouter.post('/resendOtp', (req, res) => instructorController.resendOtp(req, res));
instructorRouter.post('/verifyOtp', (req, res) => instructorController.verifyOtp(req, res));
instructorRouter.post('/login', (req, res, next) => instructorController.login(req, res, next));
instructorRouter.post('/verify-forgot-password-otp', (req, res, next) => instructorController.forgotPasswordOtpVerification(req, res, next));
instructorRouter.post('/forgot-password', (req, res, next) => instructorController.resetForgottedPassword(req, res, next));
/* User Profile Routes */
instructorRouter.put('/updateInstructor', currentUser_1.isUserAuth, (req, res, next) => instructorController.updateInstructor(req, res, next));
instructorRouter.put('/updateImage', currentUser_1.isUserAuth, multer_1.upload.single('image'), (req, res, next) => instructorController.updateImage(req, res, next));
/* Courses and Categories Routes */
instructorRouter.get('/myCourses', currentUser_1.isUserAuth, (req, res, next) => instructorController.getMycourses(req, res, next));
instructorRouter.get('/course/:courseId', currentUser_1.isUserAuth, (req, res, next) => instructorController.getSingleCourse(req, res, next));
instructorRouter.post('/addCourse', multer_1.upload.single('image'), currentUser_1.isUserAuth, (req, res) => instructorController.createCourse(req, res));
instructorRouter.put('/updateCourse/:courseId', multer_1.upload.single('image'), currentUser_1.isUserAuth, (req, res, next) => instructorController.updateCourse(req, res, next));
instructorRouter.patch('/deleteCourse/:courseId', currentUser_1.isUserAuth, (req, res, next) => instructorController.deleteCourse(req, res, next));
instructorRouter.patch('/listCourse/:courseId', currentUser_1.isUserAuth, (req, res, next) => instructorController.listCourse(req, res, next));
instructorRouter.get('/categories', currentUser_1.isUserAuth, (req, res, next) => instructorController.getCategories(req, res, next));
instructorRouter.post('/createModule', currentUser_1.isUserAuth, (req, res, next) => instructorController.createModule(req, res, next));
instructorRouter.post('/modules/:moduleId/addChapter', multer_1.upload.single('video'), currentUser_1.isUserAuth, (req, res, next) => instructorController.addChapter(req, res, next));
instructorRouter.get('/getEnrolledStudents', currentUser_1.isUserAuth, (req, res, next) => instructorController.getEnrolledCoursesByInstructor(req, res, next));
exports.default = instructorRouter;
// instructorRouter.put('/modules/:moduleId', isUserAuth, (req, res, next) => instructorController.updateModule(req, res, next));
// instructorRouter.delete('/modules/:moduleId', isUserAuth, (req, res, next) => instructorController.deleteModule(req, res, next));
