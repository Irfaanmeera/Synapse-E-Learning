"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.InstructorService = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const badrequestError_1 = require("../constants/errors/badrequestError");
const aws_config_1 = __importStar(require("../config/aws.config"));
const client_s3_1 = require("@aws-sdk/client-s3");
const { BAD_REQUEST } = httpStatusCodes_1.STATUS_CODES;
class InstructorService {
    constructor(InstructorRepository, courseRepository, categoryRepository, moduleRepository, enrolledCourseRepository) {
        this.InstructorRepository = InstructorRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.moduleRepository = moduleRepository;
        this.enrolledCourseRepository = enrolledCourseRepository;
    }
    signup(InstructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingInstructor = yield this.InstructorRepository.findInstructorByEmail(InstructorData.email);
                if (existingInstructor) {
                    throw new ErrorHandler_1.default("Instructor already exists", BAD_REQUEST);
                }
                else {
                    return yield this.InstructorRepository.createInstructor(InstructorData);
                }
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't complete Signup process");
            }
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this.InstructorRepository.findInstructorByEmail(email);
                if (!instructor) {
                    throw new ErrorHandler_1.default("Instructor not found", BAD_REQUEST);
                }
                return instructor;
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't complete login process");
            }
        });
    }
    verifyInstructor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.InstructorRepository.updateInstructorVerification(email);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't verify instructor");
            }
        });
    }
    findInstructorById(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.InstructorRepository.findInstructorById(instructorId);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't find instructor by ID");
            }
        });
    }
    updateInstructor(instructorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.InstructorRepository.updateInstructor(instructorData);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't update instructor details");
            }
        });
    }
    updateInstructorImage(instructorId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Find the current profile image of the student
                const instructor = yield this.InstructorRepository.findInstructorById(instructorId);
                // Step 2: If there's an existing image, delete it from the S3 bucket
                if (instructor && instructor.image) {
                    const fileName = decodeURIComponent(instructor.image.split("/").pop().trim());
                    const existingImage = {
                        Bucket: "synapsebucket-aws", // Your S3 bucket name
                        Key: `instructor-profile/${fileName}`, // The key (filename) of the existing image
                    };
                    yield aws_config_1.default.send(new client_s3_1.DeleteObjectCommand(existingImage)); // Delete the existing image
                }
                // Step 3: Prepare the new file for upload
                const key = `instructor-profile/${file.originalname}`; // The key (filename) for the new image
                const params = {
                    Bucket: "synapsebucket-aws", // Your S3 bucket name
                    Key: key, // The new file's key (where it will be saved in S3)
                    Body: file.buffer, // The file's content (from memory)
                    ContentType: file.mimetype, // The file's MIME type
                };
                // Step 4: Generate the file URL where the image will be accessible
                const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
                // Step 5: Upload the file to S3
                yield aws_config_1.default.send(new client_s3_1.PutObjectCommand(params));
                // Step 6: Update the student's profile image in the database with the new URL
                return yield this.InstructorRepository.updateInstructorImage(instructorId, filePath);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't upload profile image");
            }
        });
    }
    getMyCourses(instructorId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.courseRepository.getCourseByInstructor(instructorId, page);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't fetch courses for the instructor");
            }
        });
    }
    getSingleCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.getSingleCourseForInstructor(courseId);
                return course;
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't fetch the course details");
            }
        });
    }
    updateCourse(courseId, courseDetails, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCourse = yield this.courseRepository.getSingleCourseForInstructor(courseId);
                if (existingCourse && existingCourse.image) {
                    const fileName = decodeURIComponent(existingCourse.image.split("/").pop().trim());
                    const existingImage = {
                        Bucket: "synapsebucket-aws",
                        Key: `courses/${existingCourse.name.replace(/\s/g, "_")}/image/${fileName}`,
                    };
                    yield aws_config_1.default.send(new client_s3_1.DeleteObjectCommand(existingImage));
                }
                let filePath;
                if (file) {
                    const sanitizedCourseName = courseDetails.name.replace(/\s/g, "_");
                    const sanitizedFileName = encodeURIComponent(file.originalname);
                    const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;
                    const params = {
                        Bucket: "synapsebucket-aws",
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    };
                    filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
                    yield aws_config_1.default.send(new client_s3_1.PutObjectCommand(params));
                }
                const updatedCourseData = Object.assign(Object.assign({}, courseDetails), { image: filePath || existingCourse.image });
                return yield this.courseRepository.updateCourse(courseId, updatedCourseData);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't update course image");
            }
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.courseRepository.unlistCourse(courseId);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't delete the course");
            }
        });
    }
    listCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.courseRepository.listCourse(courseId);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't list the course");
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.categoryRepository.getListedCategories();
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't fetch categories");
            }
        });
    }
    createModule(moduleDetails, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, courseId } = moduleDetails;
                const module = {
                    name,
                    courseId,
                };
                const newModule = yield this.moduleRepository.createModule(module);
                yield this.courseRepository.addModule(courseId, {
                    module: newModule.id,
                    order,
                });
                return newModule;
            }
            catch (error) {
                console.log(error);
                throw new badrequestError_1.BadRequestError("Error in upload video");
            }
        });
    }
    createCourse(courseDetails, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdCourse = yield this.courseRepository.createCourse(courseDetails);
                if (file) {
                    const sanitizedCourseName = createdCourse.name.replace(/\s/g, "_");
                    const sanitizedFileName = encodeURIComponent(file.originalname);
                    const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;
                    const params = {
                        Bucket: "synapsebucket-aws",
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    };
                    const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
                    console.log(filePath);
                    yield aws_config_1.default.send(new client_s3_1.PutObjectCommand(params));
                    if (createdCourse.id) {
                        return yield this.courseRepository.addCourseImage(createdCourse.id, filePath);
                    }
                }
                // Return the created course without an image if no file was provided
                return createdCourse;
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't create course or upload image");
            }
        });
    }
    updateModule(moduleId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.moduleRepository.updateModule(moduleId, updateData);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't update module");
            }
        });
    }
    deleteModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.moduleRepository.deleteModule(moduleId);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't delete module");
            }
        });
    }
    addChapter(moduleId, chapterData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield this.moduleRepository.findModuleById(moduleId);
                if (!module) {
                    throw new badrequestError_1.BadRequestError("Module not found");
                }
                const fileKey = yield (0, aws_config_1.uploadToS3)(file);
                console.log("File key:", fileKey);
                const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
                chapterData.videoUrl = videoUrl;
                console.log("ChapterDataVideoUrl:", chapterData.videoUrl);
                console.log("Attempting to update module with ID:", moduleId);
                return yield this.moduleRepository.addChapter(moduleId, chapterData);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't add chapter to module");
            }
        });
    }
    resetForgotPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructor = yield this.InstructorRepository.findInstructorByEmail(email);
                if (!instructor) {
                    throw new badrequestError_1.BadRequestError("Instructor not found");
                }
                return yield this.InstructorRepository.updatePassword(instructor.id, password);
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Couldn't reset password");
            }
        });
    }
    getEnrolledCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield this.enrolledCourseRepository.getEnrolledCoursesByInstructor(instructorId);
                if (!enrolledCourses) {
                    throw new badrequestError_1.BadRequestError("No enrollment found");
                }
                return enrolledCourses;
            }
            catch (error) {
                console.error(error);
                throw new badrequestError_1.BadRequestError("Failed to fetch enrolled courses");
            }
        });
    }
}
exports.InstructorService = InstructorService;
