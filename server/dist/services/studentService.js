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
exports.StudentService = void 0;
const badrequestError_1 = require("../constants/errors/badrequestError");
const awsS3_config_1 = __importDefault(require("../config/awsS3.config"));
const client_s3_1 = require("@aws-sdk/client-s3");
const notFoundError_1 = require("../constants/errors/notFoundError");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const INSTRUCTOR_PERCENTAGE = 70;
class StudentService {
    constructor(studentRepository, instructorRepository, courseRepository, categoryRepository, moduleRepository, enrolledCourseRepository) {
        this.studentRepository = studentRepository;
        this.instructorRepository = instructorRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.moduleRepository = moduleRepository;
        this.enrolledCourseRepository = enrolledCourseRepository;
    }
    signup(studentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingStudent = yield this.studentRepository.findStudentByEmail(studentDetails.email);
                if (existingStudent) {
                    throw new badrequestError_1.BadRequestError("Student already exists");
                }
                return yield this.studentRepository.createStudent(studentDetails);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this.studentRepository.findStudentByEmail(email);
                if (!student) {
                    throw new badrequestError_1.BadRequestError("User not found");
                }
                else {
                    return student;
                }
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while logging in. Please try again.");
            }
        });
    }
    verifyStudent(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.updateUserVerification(email);
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while verifying the student. Please try again.");
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.findStudentByEmail(email);
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching the user by email. Please try again.");
            }
        });
    }
    findStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.findStudentById(studentId);
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching the student by ID. Please try again.");
            }
        });
    }
    updateStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.studentRepository.updateStudent(studentData);
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while updating the student. Please try again.");
            }
        });
    }
    updateImage(studentId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield this.studentRepository.findStudentById(studentId);
                if (student && student.image) {
                    const fileName = decodeURIComponent(student.image.split("/").pop().trim());
                    const existingImage = {
                        Bucket: "synapsebucket-aws",
                        Key: `profile-images/${fileName}`,
                    };
                    yield awsS3_config_1.default.send(new client_s3_1.DeleteObjectCommand(existingImage));
                }
                const key = `profile-images/${file.originalname}`;
                const params = {
                    Bucket: "synapsebucket-aws",
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };
                const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
                yield awsS3_config_1.default.send(new client_s3_1.PutObjectCommand(params));
                return yield this.studentRepository.updateImage(studentId, filePath);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't upload profile image");
            }
        });
    }
    getAllCourses(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.courseRepository.getAllCourses(page);
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching the courses");
            }
        });
    }
    getCoursesByCategoryId(categoryId_1) {
        return __awaiter(this, arguments, void 0, function* (categoryId, page = 1, limit = 10) {
            try {
                if (!categoryId) {
                    throw new Error("Category ID is required");
                }
                const result = yield this.courseRepository.getCoursesByCategory(categoryId, page, limit);
                if (!result) {
                    return { courses: [], total: 0 };
                }
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching courses by category");
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoryRepository.getAllCategories();
                return categories;
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching categories");
            }
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.getSingleCourseForInstructor(courseId);
                if (!course) {
                    throw new notFoundError_1.NotFoundError("Course not found");
                }
                return course;
            }
            catch (error) {
                console.error(error);
                throw new Error(`An error occurred while fetching course with ID ${courseId}`);
            }
        });
    }
    searchCourse(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.courseRepository.searchCoursesForStudents(details);
                return courses;
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while searching for courses");
            }
        });
    }
    updatePassword(studentId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedStudent = yield this.studentRepository.updatePassword(studentId, password);
                if (!updatedStudent) {
                    throw new Error("Password update failed. Student not found.");
                }
                return updatedStudent;
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while updating the password");
            }
        });
    }
    resetForgotPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the student by email
                const student = yield this.studentRepository.findStudentByEmail(email);
                if (!student) {
                    throw new badrequestError_1.BadRequestError("Student not found");
                }
                const updatedStudent = yield this.studentRepository.updatePassword(student.id, password);
                if (!updatedStudent) {
                    throw new Error("Failed to update password. Please try again.");
                }
                return updatedStudent;
            }
            catch (error) {
                console.error(error);
                if (error instanceof badrequestError_1.BadRequestError) {
                    throw error;
                }
                throw new Error("An error occurred while resetting the password");
            }
        });
    }
    stripePayment(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.findCourseById(courseId);
                const existingEnrollment = yield this.enrolledCourseRepository.checkEnrolledCourse(courseId, studentId);
                if (existingEnrollment) {
                    throw new badrequestError_1.BadRequestError("Already Enrolled");
                }
                if (!course) {
                    throw new badrequestError_1.BadRequestError("Course not found");
                }
                const payment = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: course.name,
                                },
                                unit_amount: course.price * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: `${process.env.ORIGIN}/status?success=true&courseId=${courseId}`,
                    cancel_url: `${process.env.ORIGIN}/status`,
                });
                return payment.url;
            }
            catch (error) {
                console.error("Stripe payment error:", error);
                throw new Error("An error occurred during the payment process");
            }
        });
    }
    enrollCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingEnrolledCourse = yield this.enrolledCourseRepository.checkEnrolledCourse(courseId, studentId);
                if (existingEnrolledCourse) {
                    throw new badrequestError_1.BadRequestError("Course already enrolled");
                }
                const course = yield this.courseRepository.findCourseById(courseId);
                if (!course) {
                    throw new badrequestError_1.BadRequestError("Course not found");
                }
                yield this.studentRepository.courseEnroll(studentId, courseId);
                const courseDetails = {
                    courseId,
                    studentId,
                    price: course === null || course === void 0 ? void 0 : course.price,
                };
                const enrolledCourse = yield this.enrolledCourseRepository.createCourse(courseDetails);
                const instructorAmount = (course.price * INSTRUCTOR_PERCENTAGE) / 100;
                const description = `Enrollment fee of ${course === null || course === void 0 ? void 0 : course.name} (ID: ${course === null || course === void 0 ? void 0 : course.id})`;
                if (course) {
                    yield this.instructorRepository.addToWallet(course.instructor, instructorAmount);
                    yield this.instructorRepository.addWalletHistory(course.instructor, instructorAmount, description);
                    yield this.courseRepository.incrementEnrolledCount(courseId);
                }
                return enrolledCourse;
            }
            catch (error) {
                console.error("Error enrolling in course:", error);
                throw new Error("An error occurred during the course enrollment process");
            }
        });
    }
    getEnrolledCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourse = yield this.enrolledCourseRepository.getCourseByStudentIdAndCourseId(studentId, courseId);
                return enrolledCourse;
            }
            catch (error) {
                console.error("Error fetching enrolled course:", error);
                throw new Error("An error occurred while fetching the enrolled course");
            }
        });
    }
    getAllEnrolledCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this.enrolledCourseRepository.getEnrolledCoursesByStudent(studentId);
                return enrolledCourses;
            }
            catch (error) {
                console.error("Error fetching enrolled courses:", error);
                throw new Error("An error occurred while fetching enrolled courses");
            }
        });
    }
    addProgression(enrollmentId, chapterTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.enrolledCourseRepository.addModuleToProgression(enrollmentId, chapterTitle);
            return response;
        });
    }
    getTotalChapterCountByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.moduleRepository.getTotalChapterCount(courseId);
        });
    }
}
exports.StudentService = StudentService;
