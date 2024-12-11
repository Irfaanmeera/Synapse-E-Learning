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
exports.InstructorController = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const badrequestError_1 = require("../constants/errors/badrequestError");
const forbiddenError_1 = require("../constants/errors/forbiddenError");
const generateJWT_1 = require("../utils/generateJWT");
const IUserRoles_1 = __importDefault(require("../interfaces/entityInterface/IUserRoles"));
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = httpStatusCodes_1.STATUS_CODES;
class InstructorController {
    constructor(instructorService, otpService) {
        this.instructorService = instructorService;
        this.otpService = otpService;
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, password } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const instructorData = {
                    name,
                    email,
                    mobile,
                    password: hashedPassword,
                };
                yield this.instructorService.signup(instructorData);
                const otp = this.otpService.generateOtp();
                yield this.otpService.createOtp({ email, otp });
                this.otpService.sendOtpMail(email, otp);
                res
                    .status(OK)
                    .json({ success: true, message: "OTP sent for verification..." });
            }
            catch (error) {
                console.log(error);
                res
                    .status(INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Internal server error" });
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
                    const instructor = yield this.instructorService.verifyInstructor(email);
                    if (!instructor || !instructor.id) {
                        throw new Error("Instructor or Instructor ID is missing.");
                    }
                    const token = (0, generateJWT_1.generateToken)(instructor.id, IUserRoles_1.default.Instructor, process.env.JWT_SECRET, "1m");
                    const refreshToken = (0, generateJWT_1.generateToken)(instructor.id, IUserRoles_1.default.Instructor, process.env.JWT_REFRESH_SECRET, "7d");
                    const instructorData = {
                        _id: instructor.id,
                        name: instructor.name,
                        email: instructor.email,
                        mobile: instructor.mobile,
                        image: instructor.image,
                        wallet: instructor.wallet,
                        qualification: instructor.qualification,
                        description: instructor.description,
                        courses: instructor.courses,
                        role: IUserRoles_1.default.Instructor,
                    };
                    res.status(200).json({
                        message: "Instructor Verified",
                        token,
                        refreshToken,
                        instructor: instructorData,
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
                const instructor = yield this.instructorService.login(email);
                const validPassword = yield bcryptjs_1.default.compare(password, instructor.password);
                if (!instructor || !instructor.id) {
                    throw new Error("Instructor or Instructor ID is missing.");
                }
                if (!instructor.isBlocked) {
                    if (validPassword) {
                        if (instructor.isVerified) {
                            const token = (0, generateJWT_1.generateToken)(instructor.id, IUserRoles_1.default.Instructor, process.env.JWT_SECRET, "1m");
                            const refreshToken = (0, generateJWT_1.generateToken)(instructor.id, IUserRoles_1.default.Instructor, process.env.JWT_REFRESH_SECRET, "7d");
                            const instructorData = {
                                _id: instructor.id,
                                name: instructor.name,
                                email: instructor.email,
                                mobile: instructor.mobile,
                                image: instructor.image,
                                qualification: instructor.qualification,
                                description: instructor.description,
                                wallet: instructor.wallet,
                                courses: instructor.courses,
                                walletHistory: instructor.walletHistory,
                                role: IUserRoles_1.default.Instructor,
                            };
                            res.status(200).json({
                                message: "Instructor Verified",
                                token,
                                refreshToken,
                                instructor: instructorData,
                            });
                        }
                        else {
                            const otp = this.otpService.generateOtp();
                            yield this.otpService.createOtp({ email, otp });
                            this.otpService.sendOtpMail(email, otp);
                            throw new ErrorHandler_1.default("Not verified", BAD_REQUEST);
                        }
                    }
                    else {
                        res.status(400).json({ message: "Incorrect password" });
                        throw new ErrorHandler_1.default("Incorrect password", BAD_REQUEST);
                    }
                }
                else {
                    res.status(403).json({ message: "Instructor Blocked" });
                    throw new forbiddenError_1.ForbiddenError("Instructor Blocked");
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateInstructor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.currentUser;
                const { name, mobile, qualification, description } = req.body;
                const instructor = yield this.instructorService.updateInstructor({
                    name,
                    mobile,
                    qualification,
                    description,
                });
                res.status(200).json(instructor);
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
                const student = yield this.instructorService.updateInstructorImage(id, file);
                res.status(200).json(student);
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
                const instructor = yield this.instructorService.resetForgotPassword(email, hashedPassword);
                res.status(200).json(instructor);
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        });
    }
    getMycourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pageNo = 0;
                const { page } = req.query;
                if (page !== undefined && !isNaN(Number(page))) {
                    pageNo = Number(page);
                }
                const instructorId = req.currentUser;
                if (!instructorId) {
                    throw new forbiddenError_1.ForbiddenError("Invalid token");
                }
                const courses = yield this.instructorService.getMyCourses(instructorId, pageNo);
                res.status(200).json(courses);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructorId = req.currentUser;
                const { name, description, level, category, price } = req.body;
                const courseDetails = {
                    name,
                    description,
                    level,
                    category,
                    price,
                    instructor: instructorId,
                };
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ error: "Image file is required." });
                }
                const createdCourse = yield this.instructorService.createCourse(courseDetails, file);
                return res.status(201).json(createdCourse);
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while creating the course." });
            }
        });
    }
    getSingleCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                if (!courseId) {
                    throw new badrequestError_1.BadRequestError("Course id not found");
                }
                const course = yield this.instructorService.getSingleCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    updateCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const { name, description, price, level, category } = req.body;
                const courseDetails = {
                    name,
                    description,
                    price,
                    level,
                    category,
                };
                const file = req.file ? req.file : undefined;
                if (!file) {
                    throw new badrequestError_1.BadRequestError("File not found");
                }
                const updatedCourse = yield this.instructorService.updateCourse(courseId, courseDetails, file);
                res.status(200).json(updatedCourse);
            }
            catch (error) {
                console.error("Error updating course:", error);
                next(error);
            }
        });
    }
    deleteCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                if (!courseId) {
                    throw new badrequestError_1.BadRequestError("Course id not found");
                }
                const course = yield this.instructorService.deleteCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    listCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                if (!courseId) {
                    throw new badrequestError_1.BadRequestError("Course id not found");
                }
                const course = yield this.instructorService.listCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.instructorService.getAllCategories();
                res.status(200).json(categories);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    createModule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const moduleData = req.body;
                const existingModule = yield this.instructorService.getSingleCourse(moduleData.courseId);
                const order = (((_a = existingModule === null || existingModule === void 0 ? void 0 : existingModule.modules) === null || _a === void 0 ? void 0 : _a.length) || 0) + 1;
                const module = yield this.instructorService.createModule(moduleData, order);
                res.status(201).json(module);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    // async updateModule(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const { moduleId } = req.params;
    //     const updateData = req.body;
    //     const updatedModule = await this.instructorService.updateModule(
    //       moduleId,
    //       updateData
    //     );
    //     res.status(200).json(updatedModule);
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       next(error);
    //     }
    //   }
    // }
    // async deleteModule(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const { moduleId } = req.params;
    //     await this.instructorService.deleteModule(moduleId);
    //     res.status(200).json({ message: "Module deleted successfully" });
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       next(error);
    //     }
    //   }
    // }
    addChapter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { moduleId } = req.params;
                const chapterData = req.body;
                const file = req.file;
                const module = yield this.instructorService.addChapter(moduleId, chapterData, file);
                res.status(201).json(module);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
            }
        });
    }
    getEnrolledCoursesByInstructor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructorId = req.currentUser;
                if (!instructorId) {
                    throw new forbiddenError_1.ForbiddenError("Invalid token");
                }
                const enrolledCourses = yield this.instructorService.getEnrolledCoursesByInstructor(instructorId);
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
}
exports.InstructorController = InstructorController;
