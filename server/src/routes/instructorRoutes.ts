import express, { Router } from 'express';
import { InstructorController } from '../controllers/instructorController';
import { isUserAuth } from '../middlewares/currentUser';
import { upload } from '../middlewares/multer';
import { InstructorRepository, CourseRepository, CategoryRepository, ModuleRepository, EnrolledCourseRepository, OtpRepository } from '../repositories';
import { InstructorService } from '../services/instructorService';
import { OtpService } from '../services/otpService';

const instructorRouter: Router = express.Router();

const instructorRepository = new InstructorRepository();
const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const moduleRepository = new ModuleRepository();
const enrolledCourseRepository = new EnrolledCourseRepository();
const otpRepository = new OtpRepository()

const otpService = new OtpService(otpRepository)
const instructorService = new InstructorService(
  instructorRepository,
  courseRepository,
  categoryRepository,
  moduleRepository,
  enrolledCourseRepository
);

const instructorController = new InstructorController(instructorService,otpService);

/* Authentication Routes */
instructorRouter.post('/signup', (req, res, next) => instructorController.signup(req, res, next));
instructorRouter.post('/resendOtp', (req, res) => instructorController.resendOtp(req, res));
instructorRouter.post('/verifyOtp', (req, res) => instructorController.verifyOtp(req, res));
instructorRouter.post('/login', (req, res, next) => instructorController.login(req, res, next));
instructorRouter.post('/verify-forgot-password-otp', (req, res, next) => instructorController.forgotPasswordOtpVerification(req, res, next));
instructorRouter.post('/forgot-password', (req, res, next) => instructorController.resetForgottedPassword(req, res, next));

/* User Profile Routes */
instructorRouter.put('/updateInstructor', isUserAuth, (req, res, next) => instructorController.updateInstructor(req, res, next));
instructorRouter.put('/updateImage', isUserAuth, upload.single('image'), (req, res, next) => instructorController.updateImage(req, res, next));

/* Courses and Categories Routes */
instructorRouter.get('/myCourses', isUserAuth, (req, res, next) => instructorController.getMycourses(req, res, next));
instructorRouter.get('/course/:courseId', isUserAuth, (req, res, next) => instructorController.getSingleCourse(req, res, next));
instructorRouter.post('/addCourse', upload.single('image'), isUserAuth, (req, res) => instructorController.createCourse(req, res));
instructorRouter.put('/updateCourse/:courseId', upload.single('image'), isUserAuth, (req, res, next) => instructorController.updateCourse(req, res, next));
instructorRouter.patch('/deleteCourse/:courseId', isUserAuth, (req, res, next) => instructorController.deleteCourse(req, res, next));
instructorRouter.patch('/listCourse/:courseId', isUserAuth, (req, res, next) => instructorController.listCourse(req, res, next));
instructorRouter.get('/categories', isUserAuth, (req, res, next) => instructorController.getCategories(req, res, next));
instructorRouter.post('/createModule', isUserAuth, (req, res, next) => instructorController.createModule(req, res, next));
instructorRouter.post('/modules/:moduleId/addChapter', upload.single('video'), isUserAuth, (req, res, next) => instructorController.addChapter(req, res, next));
instructorRouter.get('/getEnrolledStudents', isUserAuth, (req, res, next) => instructorController.getEnrolledCoursesByInstructor(req, res, next));

export default instructorRouter;


// instructorRouter.put('/modules/:moduleId', isUserAuth, (req, res, next) => instructorController.updateModule(req, res, next));
// instructorRouter.delete('/modules/:moduleId', isUserAuth, (req, res, next) => instructorController.deleteModule(req, res, next));