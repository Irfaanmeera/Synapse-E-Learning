/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/studentService";
import { OtpService } from "../services/otpService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import bcrypt from "bcryptjs";
import { IStudent, ISearch } from "../interfaces/entityInterface";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../constants/errors/badrequestError";
import { ForbiddenError } from "../constants/errors/forbiddenError";
import { generateToken } from "../utils/generateJWT";
import UserRole from "../interfaces/entityInterface/IUserRoles";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;

const otpService = new OtpService();

export class StudentController {
  constructor(private studentService: StudentService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const studentDetails: IStudent = {
        name,
        email,
        password: hashedPassword,
        mobile,
      };
      await this.studentService.signup(studentDetails);
      const otp = otpService.generateOtp();
      await otpService.createOtp({ email, otp });
      otpService.sendOtpMail(email, otp);
      res.status(201).json({ message: "OTP sent for verification...", email });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(error);
      } else {
        console.log("An unknown error occured");
      }
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
        const student: IStudent = await this.studentService.verifyStudent(
          email
        );
        
        if (!student || !student.id) {
          throw new Error("Student or Student ID is missing.");
        }
        const token = generateToken(
          student.id,
          UserRole.Student,
          process.env.JWT_SECRET!,
          "15m"
        );
        const refreshToken = generateToken(
          student.id,
          UserRole.Student,
          process.env.JWT_REFRESH_SECRET!,
          "7d"
        );

        const studentData = {
          _id: student.id,
          name: student.name,
          email: student.email,
          mobile: student.mobile,
          wallet: student.wallet,
          courses: student.courses,
          image: student.image,
          role: UserRole.Student,
        };

        res.status(200).json({
          message: "Student Verified",
          token,
          refreshToken,
          student: studentData,
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
      const student: IStudent = await this.studentService.login(email);

      if (!student.isBlocked) {
        const validPassword = await bcrypt.compare(password, student.password!);
        if (!validPassword) {
          return res.status(400).json({ message: "Incorrect password" });
        }

        if (!student.isVerified) {
          const otp = otpService.generateOtp();
          await otpService.createOtp({ email, otp });
          otpService.sendOtpMail(email, otp);
          return res.status(400).json({ message: "Not verified" });
        }

        if (!student || !student.id) {
          throw new Error("Student or Student ID is missing.");
        }
        const token = generateToken(
          student.id,
          UserRole.Student,
          process.env.JWT_SECRET!,
          "15m"
        );
        const refreshToken = generateToken(
          student.id,
          UserRole.Student,
          process.env.JWT_REFRESH_SECRET!,
          "7d"
        );

        const studentData = {
          _id: student.id,
          name: student.name,
          email: student.email,
          mobile: student.mobile,
          wallet: student.wallet,
          courses: student.courses,
          image: student.image,
          role: UserRole.Student,
        };

        return res.status(200).json({
          message: "Student Verified",
          token,
          refreshToken,
          student: studentData,
        });
      } else {
        throw new ForbiddenError("Student Blocked");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, googlePhotoUrl } = req.body;
      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

      const student = await this.studentService.getUserByEmail(email);

      if (student) {
        const token = jwt.sign(
          { studentId: student.id, role: "student" },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
          { studentId: student.id, role: "student" },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );

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
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newStudent: IStudent = {
          name,
          email,
          password: hashedPassword,
          mobile: "",
          image: googlePhotoUrl,
          wallet: 0,
          courses: [],
          isVerified: true,
        };

        const savedStudent = await this.studentService.signup(newStudent);

        if (!savedStudent) {
          res
            .status(INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Failed to create new student" });
          return;
        }

        const token = jwt.sign(
          { studentId: savedStudent.id, role: "student" },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
          { studentId: savedStudent.id, role: "student" },
          process.env.JWT_REFRESH_SECRET!,
          { expiresIn: "7d" }
        );

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
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const { name, mobile } = req.body;
      const student = await this.studentService.updateStudent({
        id,
        name,
        mobile,
      });
      res.status(200).json(student);
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
      const student = await this.studentService.updateImage(id!, file);
      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.params;

      const pageNumber = Number(page);

      const courses = await this.studentService.getAllCourses(pageNumber);

      res.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async searchCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category } = req.query;
      const inputs: ISearch = {};

      if (search) {
        inputs.$or = [
          { name: { $regex: search as string, $options: "i" } },
          { description: { $regex: search as string, $options: "i" } },
        ];
      }
      if (category && category !== "undefined") {
        inputs.category = category as string;
      }

      const course = await this.studentService.searchCourse(inputs);

      res.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getCoursesByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      const result = await this.studentService.getCoursesByCategoryId(
        categoryId as string,
        page,
        limit
      );

      return res.status(200).json({
        courses: result.courses,
        total: result.total,
      });
    } catch (error) {
      console.error("Error fetching courses by category:", error);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.studentService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, currentPassword } = req.body;
      const studentId = req.currentUser;
      if (!studentId) {
        throw new Error("Invalid token");
      }
      const student: IStudent | null =
        await this.studentService.findStudentById(studentId);

      const isPasswordVerified = await bcrypt.compare(
        currentPassword,
        student!.password!
      );

      if (!isPasswordVerified) {
        throw new BadRequestError("Incorrect password");
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const {
          name,
          email,
          id,
          mobile,
          courses,
          wallet,
          isBlocked,
          isVerified,
        } = await this.studentService.updatePassword(studentId, hashedPassword);
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
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const course = await this.studentService.getSingleCourse(courseId);
      res.status(200).json(course);
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
      const student = await this.studentService.resetForgotPassword(
        email,
        hashedPassword
      );
      res.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async stripePaymentIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const { courseId } = req.body;
      const url = await this.studentService.stripePayment(courseId!, id!);
      res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.currentUser;
      const { courseId } = req.body;
      const enrolledCourse = await this.studentService.enrollCourse(
        courseId,
        id!
      );
      res.status(201).json(enrolledCourse);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }

  async getEnrolledCoursesByStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const studentId = req.currentUser;

      const enrolledCourses = await this.studentService.getAllEnrolledCourses(
        studentId!
      );

      res.status(200).json(enrolledCourses);
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  async getEnrolledCourseByStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const studentId = req.currentUser;
      const { courseId } = req.params;
      const enrolledCourse = await this.studentService.getEnrolledCourse(
        studentId!,
        courseId
      );
      res.status(200).json(enrolledCourse);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return next(error);
      }
    }
  }

  async addProgression(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId, chapterTitle } = req.query;

      const progression = await this.studentService.addProgression(
        enrollmentId as string,
        chapterTitle as string
      );

      res.status(201).json(progression);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getTotalChapterCountByCourseId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    try {
      const totalChapterCount =
        await this.studentService.getTotalChapterCountByCourseId(courseId);

      return res
        .status(200)
        .json({ courseId, totalChapters: totalChapterCount });
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}
