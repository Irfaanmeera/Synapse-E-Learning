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
exports.StudentController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const badrequestError_1 = require("../constants/errors/badrequestError");
const forbiddenError_1 = require("../constants/errors/forbiddenError");
const generateJWT_1 = require("../utils/generateJWT");
const IUserRoles_1 = __importDefault(require("../interfaces/entityInterface/IUserRoles"));
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
class StudentController {
    constructor(studentService, otpService) {
        this.studentService = studentService;
        this.otpService = otpService;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, mobile } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const studentDetails = {
                    name,
                    email,
                    password: hashedPassword,
                    mobile,
                };
                yield this.studentService.signup(studentDetails);
                const otp = this.otpService.generateOtp();
                yield this.otpService.createOtp({ email, otp });
                this.otpService.sendOtpMail(email, otp);
                res.status(201).json({ message: "OTP sent for verification...", email });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    return next(error);
                }
                else {
                    console.log("An unknown error occured");
                }
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const otp = this.otpService.generateOtp();
                yield this.otpService.createOtp({ email, otp });
                this.otpService.sendOtpMail(email, otp);
                res.status(OK).json({ success: true, message: "OTP Resent" });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const existingOtp = yield this.otpService.findOtp(email);
                if (otp === (existingOtp === null || existingOtp === void 0 ? void 0 : existingOtp.otp)) {
                    const student = yield this.studentService.verifyStudent(email);
                    if (!student || !student.id) {
                        throw new Error("Student or Student ID is missing.");
                    }
                    const token = (0, generateJWT_1.generateToken)(student.id, IUserRoles_1.default.Student, process.env.JWT_SECRET, "15m");
                    const refreshToken = (0, generateJWT_1.generateToken)(student.id, IUserRoles_1.default.Student, process.env.JWT_REFRESH_SECRET, "7d");
                    const studentData = {
                        _id: student.id,
                        name: student.name,
                        email: student.email,
                        mobile: student.mobile,
                        wallet: student.wallet,
                        courses: student.courses,
                        image: student.image,
                        role: IUserRoles_1.default.Student,
                    };
                    res.status(200).json({
                        message: "Student Verified",
                        token,
                        refreshToken,
                        student: studentData,
                    });
                }
                else {
                    res.status(400).json({ message: "OTP Verification failed" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const student = yield this.studentService.login(email);
                if (!student.isBlocked) {
                    const validPassword = yield bcryptjs_1.default.compare(password, student.password);
                    if (!validPassword) {
                        return res.status(400).json({ message: "Incorrect password" });
                    }
                    if (!student.isVerified) {
                        const otp = this.otpService.generateOtp();
                        yield this.otpService.createOtp({ email, otp });
                        this.otpService.sendOtpMail(email, otp);
                        return res.status(400).json({ message: "Not verified" });
                    }
                    if (!student || !student.id) {
                        throw new Error("Student or Student ID is missing.");
                    }
                    const token = (0, generateJWT_1.generateToken)(student.id, IUserRoles_1.default.Student, process.env.JWT_SECRET, "15m");
                    const refreshToken = (0, generateJWT_1.generateToken)(student.id, IUserRoles_1.default.Student, process.env.JWT_REFRESH_SECRET, "7d");
                    const studentData = {
                        _id: student.id,
                        name: student.name,
                        email: student.email,
                        mobile: student.mobile,
                        wallet: student.wallet,
                        courses: student.courses,
                        image: student.image,
                        role: IUserRoles_1.default.Student,
                    };
                    return res.status(200).json({
                        message: "Student Verified",
                        token,
                        refreshToken,
                        student: studentData,
                    });
                }
                else {
                    throw new forbiddenError_1.ForbiddenError("Student Blocked");
                }
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        });
    }
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, googlePhotoUrl } = req.body;
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
                const student = yield this.studentService.getUserByEmail(email);
                if (student) {
                    const token = jsonwebtoken_1.default.sign({ studentId: student.id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "15m" });
                    const refreshToken = jsonwebtoken_1.default.sign({ studentId: student.id, role: "student" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
                    const studentData = {
                        _id: student.id,
                        name: student.name,
                        email: student.email,
                        mobile: student.mobile,
                        wallet: student.wallet,
                        courses: student.courses,
                        image: student.image || googlePhotoUrl,
                        role: "student",
                    };
                    res
                        .status(OK)
                        .cookie("token", token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                    })
                        .cookie("refreshToken", refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                    })
                        .json({
                        success: true,
                        message: "Login Successful",
                        token,
                        refreshToken,
                        student: studentData,
                    });
                    return;
                }
                else {
                    const generatedPassword = Math.random().toString(36).slice(-8) +
                        Math.random().toString(36).slice(-8);
                    const hashedPassword = yield bcryptjs_1.default.hash(generatedPassword, 10);
                    const newStudent = {
                        name,
                        email,
                        password: hashedPassword,
                        mobile: "",
                        image: googlePhotoUrl,
                        wallet: 0,
                        courses: [],
                        isVerified: true,
                    };
                    const savedStudent = yield this.studentService.signup(newStudent);
                    if (!savedStudent) {
                        res
                            .status(INTERNAL_SERVER_ERROR)
                            .json({ success: false, message: "Failed to create new student" });
                        return;
                    }
                    const token = jsonwebtoken_1.default.sign({ studentId: savedStudent.id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "15m" });
                    const refreshToken = jsonwebtoken_1.default.sign({ studentId: savedStudent.id, role: "student" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
                    const studentData = {
                        _id: savedStudent.id,
                        name: savedStudent.name,
                        email: savedStudent.email,
                        mobile: savedStudent.mobile,
                        wallet: savedStudent.wallet,
                        courses: savedStudent.courses,
                        image: savedStudent.image,
                        role: "student",
                    };
                    res
                        .status(OK)
                        .cookie("access_token", token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                    })
                        .cookie("refresh_token", refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                    })
                        .json({
                        success: true,
                        message: "Google Login Successful, New Student Created",
                        token,
                        refreshToken,
                        student: studentData,
                    });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res
                    .status(INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Internal server error" });
                return;
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.currentUser;
                const { name, mobile } = req.body;
                const student = yield this.studentService.updateStudent({
                    id,
                    name,
                    mobile,
                });
                res.status(200).json(student);
            }
            catch (error) {
                console.log(error);
                res
                    .status(INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Internal server error" });
                return;
            }
        });
    }
    updateImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.currentUser;
                const file = req.file;
                if (!id) {
                    throw new badrequestError_1.BadRequestError("Id not found");
                }
                if (!file) {
                    throw new badrequestError_1.BadRequestError("Image not found");
                }
                const student = yield this.studentService.updateImage(id, file);
                res.status(200).json(student);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getAllCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page } = req.params;
                const pageNumber = Number(page);
                const courses = yield this.studentService.getAllCourses(pageNumber);
                res.status(200).json(courses);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    searchCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, category } = req.query;
                const inputs = {};
                if (search) {
                    inputs.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } },
                    ];
                }
                if (category && category !== "undefined") {
                    inputs.category = category;
                }
                const course = yield this.studentService.searchCourse(inputs);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getCoursesByCategoryId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                if (!categoryId) {
                    return res.status(400).json({ error: "Category ID is required" });
                }
                const result = yield this.studentService.getCoursesByCategoryId(categoryId, page, limit);
                return res.status(200).json({
                    courses: result.courses,
                    total: result.total,
                });
            }
            catch (error) {
                console.error("Error fetching courses by category:", error);
                return res.status(500).json({ error: "Failed to fetch courses" });
            }
        });
    }
    getAllCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.studentService.getAllCategories();
                res.status(200).json(categories);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPassword, currentPassword } = req.body;
                const studentId = req.currentUser;
                if (!studentId) {
                    throw new Error("Invalid token");
                }
                const student = yield this.studentService.findStudentById(studentId);
                const isPasswordVerified = yield bcryptjs_1.default.compare(currentPassword, student.password);
                if (!isPasswordVerified) {
                    throw new badrequestError_1.BadRequestError("Incorrect password");
                }
                else {
                    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                    const { name, email, id, mobile, courses, wallet, isBlocked, isVerified, } = yield this.studentService.updatePassword(studentId, hashedPassword);
                    const updatedData = {
                        name,
                        email,
                        id,
                        mobile,
                        courses,
                        wallet,
                        isBlocked,
                        isVerified,
                    };
                    res.status(200).json(updatedData);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getSingleCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield this.studentService.getSingleCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    forgotPasswordOtpVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                const savedOtp = yield this.otpService.findOtp(email);
                if ((savedOtp === null || savedOtp === void 0 ? void 0 : savedOtp.otp) === otp) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    resetForgottedPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const student = yield this.studentService.resetForgotPassword(email, hashedPassword);
                res.status(200).json(student);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    stripePaymentIntent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.currentUser;
                const { courseId } = req.body;
                const url = yield this.studentService.stripePayment(courseId, id);
                res.status(200).json({ url });
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    enrollCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.currentUser;
                const { courseId } = req.body;
                const enrolledCourse = yield this.studentService.enrollCourse(courseId, id);
                res.status(201).json(enrolledCourse);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getEnrolledCoursesByStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.currentUser;
                const enrolledCourses = yield this.studentService.getAllEnrolledCourses(studentId);
                res.status(200).json(enrolledCourses);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getEnrolledCourseByStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.currentUser;
                const { courseId } = req.params;
                const enrolledCourse = yield this.studentService.getEnrolledCourse(studentId, courseId);
                res.status(200).json(enrolledCourse);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    return next(error);
                }
            }
        });
    }
    addProgression(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId, chapterTitle } = req.query;
                const progression = yield this.studentService.addProgression(enrollmentId, chapterTitle);
                res.status(201).json(progression);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getTotalChapterCountByCourseId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({ message: "Course ID is required" });
            }
            try {
                const totalChapterCount = yield this.studentService.getTotalChapterCountByCourseId(courseId);
                return res
                    .status(200)
                    .json({ courseId, totalChapters: totalChapterCount });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
}
exports.StudentController = StudentController;
