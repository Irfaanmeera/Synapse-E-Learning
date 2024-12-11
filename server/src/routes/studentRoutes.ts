import express, { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { isUserAuth } from '../middlewares/currentUser';
import { upload } from '../middlewares/multer';
import {
  StudentRepository,
  InstructorRepository,
  CourseRepository,
  CategoryRepository,
  EnrolledCourseRepository,
  ModuleRepository,
  OtpRepository,
} from '../repositories';
import { StudentService } from '../services/studentService';
import { OtpService } from '../services/otpService';

const studentRouter: Router = express.Router();

const studentRepository = new StudentRepository();
const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const enrolledCourseRepository = new EnrolledCourseRepository();
const moduleRepository = new ModuleRepository();
const otpRepository = new OtpRepository()

const otpService = new OtpService(otpRepository)
const studentService = new StudentService(
  studentRepository,
  instructorRepository,
  courseRepository,
  categoryRepository,
  moduleRepository,
  enrolledCourseRepository
);

const studentController = new StudentController(studentService,otpService);

/* Authentication Routes */
studentRouter.post('/signup', (req, res, next) => studentController.signup(req, res, next));
studentRouter.post('/resendOtp', (req, res) => studentController.resendOtp(req, res));
studentRouter.post('/verifyOtp', (req, res) => studentController.verifyOtp(req, res));
studentRouter.post('/login', (req, res, next) => studentController.login(req, res, next));
studentRouter.post('/google-login', (req, res, next) => studentController.googleLogin(req, res, next));
studentRouter.post('/verify-forgot-password-otp', (req, res, next) => studentController.forgotPasswordOtpVerification(req, res, next));
studentRouter.post('/forgot-password', (req, res, next) => studentController.resetForgottedPassword(req, res, next));

/* User Profile Routes */
studentRouter.put('/updateUser', isUserAuth, (req, res, next) => studentController.updateUser(req, res, next));
studentRouter.put('/updateImage', isUserAuth, upload.single('image'), (req, res, next) => studentController.updateImage(req, res, next));

/* Courses and Categories Routes */
studentRouter.get('/courses', (req, res, next) => studentController.getAllCourses(req, res, next));
studentRouter.get("/searchCourse", (req, res, next) => studentController.searchCourses(req, res, next));
studentRouter.get('/coursesByCategory',(req,res,next)=>studentController.getCoursesByCategoryId(req,res,next))
studentRouter.get('/categories', (req, res, next) => studentController.getAllCategories(req, res, next));
studentRouter.get('/course/:courseId', (req, res, next) => studentController.getSingleCourse(req, res, next));

/* Enrollment and Progression Routes */
studentRouter.post('/createPayment', isUserAuth, (req, res, next) => studentController.stripePaymentIntent(req, res, next));
studentRouter.post('/enrollCourse', isUserAuth, (req, res, next) => studentController.enrollCourse(req, res, next));
studentRouter.get('/getEnrolledCourse/:courseId', isUserAuth, (req, res, next) => studentController.getEnrolledCourseByStudent(req, res, next));
studentRouter.get('/getEnrolledCoursesByStudent', isUserAuth, (req, res, next) => studentController.getEnrolledCoursesByStudent(req, res, next));
studentRouter.get('/addProgression', isUserAuth, (req, res, next) => studentController.addProgression(req, res, next));
studentRouter.get('/totalChapterCount/:courseId', (req, res, next) => studentController.getTotalChapterCountByCourseId(req, res, next));

export default studentRouter;
