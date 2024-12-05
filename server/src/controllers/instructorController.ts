/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { InstructorService } from "../services/instructorService";
import { OtpService } from "../services/otpService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import bcrypt from "bcryptjs";
import { IInstructor } from "../interfaces/entityInterface/IInstructor";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import { BadRequestError } from "../constants/errors/badrequestError";
import { ForbiddenError } from "../constants/errors/forbiddenError";
import { generateToken } from "../utils/generateJWT";
import UserRole from "../interfaces/entityInterface/IUserRoles";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;

const otpService = new OtpService();

export class InstructorController {
  constructor(private instructorService: InstructorService) { }
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const instructorData: IInstructor = {
        name,
        email,
        mobile,
        password: hashedPassword,
      };
      await this.instructorService.signup(instructorData);
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpMail(email, otp);
      res
        .status(OK)
        .json({ success: true, message: "OTP sent for verification..." });
    } catch (error) {
      console.log(error as Error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpMail(email, otp);
      res.status(OK).json({ success: true, message: "OTP Resent" });
    } catch (error) {
      console.log(error as Error);
    }
  }
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const existingOtp = await otpService.findOtp(email);
      if (otp === existingOtp?.otp) {
        const instructor: IInstructor =
          await this.instructorService.verifyInstructor(email);
        if (!instructor || !instructor.id) {
          throw new Error("Instructor or Instructor ID is missing.");
        }

        const token = generateToken(
          instructor.id,
          UserRole.Instructor,
          process.env.JWT_SECRET!,
          "1m"
        );
        const refreshToken = generateToken(
          instructor.id,
          UserRole.Instructor,
          process.env.JWT_REFRESH_SECRET!,
          "7d"
        );
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
          role: UserRole.Instructor,
        };
        res.status(200).json({
          message: "Instructor Verified",
          token,
          refreshToken,
          instructor: instructorData,
        });
      } else {
        res.status(400).json({ message: "OTP Verification failed" });
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const instructor: IInstructor = await this.instructorService.login(email);
      const validPassword = await bcrypt.compare(
        password,
        instructor.password!
      );
      if (!instructor || !instructor.id) {
        throw new Error("Instructor or Instructor ID is missing.");
      }

      if (!instructor.isBlocked) {
        if (validPassword) {
          if (instructor.isVerified) {
            const token = generateToken(
              instructor.id,
              UserRole.Instructor,
              process.env.JWT_SECRET!,
              "1m"
            );
            const refreshToken = generateToken(
              instructor.id,
              UserRole.Instructor,
              process.env.JWT_REFRESH_SECRET!,
              "7d"
            );
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
              role: UserRole.Instructor,
            };

            res.status(200).json({
              message: "Instructor Verified",
              token,
              refreshToken,
              instructor: instructorData,
            });
          } else {
            const otp = otpService.generateOtp();
            await otpService.createOtp({ email, otp });
            otpService.sendOtpMail(email, otp);
            throw new ErrorHandler("Not verified", BAD_REQUEST);
          }
        } else {
          res.status(400).json({ message: "Incorrect password" });
          throw new ErrorHandler("Incorrect password", BAD_REQUEST);
        }
      } else {
        res.status(403).json({ message: "Instructor Blocked" });
        throw new ForbiddenError("Instructor Blocked");
      }
    } catch (error) {
      console.log(error as Error);
    }
  }
  async updateInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const { name, mobile, qualification, description } = req.body;
      const instructor = await this.instructorService.updateInstructor({
        id,
        name,
        mobile,
        qualification,
        description,
      });
      res.status(200).json(instructor);
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const file = req.file;
      if (!id) {
        throw new BadRequestError("Id not found");
      }
      if (!file) {
        throw new BadRequestError("Image not found");
      }
      const student = await this.instructorService.updateInstructorImage(
        id!,
        file
      );
      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async forgotPasswordOtpVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp, email } = req.body;
      const savedOtp = await otpService.findOtp(email);
      if (savedOtp?.otp === otp) {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async resetForgottedPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const instructor = await this.instructorService.resetForgotPassword(
        email,
        hashedPassword
      );
      res.status(200).json(instructor);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getMycourses(req: Request, res: Response, next: NextFunction) {
    try {
      let pageNo = 0;
      const { page } = req.query;
      if (page !== undefined && !isNaN(Number(page))) {
        pageNo = Number(page);
      }
      const instructorId = req.currentUser;
      if (!instructorId) {
        throw new ForbiddenError("Invalid token");
      }
      const courses = await this.instructorService.getMyCourses(
        instructorId,
        pageNo
      );
      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async createCourse(req: Request, res: Response) {
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
      const file: Express.Multer.File | undefined = req.file;

      if (!file) {
        return res.status(400).json({ error: "Image file is required." });
      }

      const createdCourse = await this.instructorService.createCourse(
        courseDetails,
        file
      );
      return res.status(201).json(createdCourse);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while creating the course." });
    }
  }
  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await this.instructorService.getSingleCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
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


      const updatedCourse = await this.instructorService.updateCourse(
        courseId,
        courseDetails,
        file
      );


      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await this.instructorService.deleteCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async listCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        throw new BadRequestError("Course id not found");
      }
      const course = await this.instructorService.listCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.instructorService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const moduleData = req.body;
      const existingModule = await this.instructorService.getSingleCourse(
        moduleData.courseId
      );


      const order = (existingModule?.modules?.length || 0) + 1;
      const module = await this.instructorService.createModule(
        moduleData,
        order
      );
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async updateModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const updateData = req.body;
      const updatedModule = await this.instructorService.updateModule(
        moduleId,
        updateData
      );
      res.status(200).json(updatedModule);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      await this.instructorService.deleteModule(moduleId);
      res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  async addChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const chapterData = req.body;
      const file = req.file;


      const module = await this.instructorService.addChapter(
        moduleId,
        chapterData,
        file!
      );
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getEnrolledCoursesByInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser;

      if (!instructorId) {
        throw new ForbiddenError("Invalid token");
      }
      const enrolledCourses =
        await this.instructorService.getEnrolledCoursesByInstructor(
          instructorId!
        );
      res.status(201).json(enrolledCourses);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        next(error);
      }
    }
  }
}
