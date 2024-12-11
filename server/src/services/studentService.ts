import { IStudentService } from "../interfaces/serviceInterfaces/IStudentService";
import { BadRequestError } from "../constants/errors/badrequestError";
import s3 from "../config/awsS3.config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ICourse, ISearch } from "../interfaces/entityInterface/ICourse";
import {
  ICategory,
  IStudent,
  IEnrolledCourse,
} from "../interfaces/entityInterface";
import { NotFoundError } from "../constants/errors/notFoundError";
import Stripe from "stripe";
import { ICategoryRepository, ICourseRepository, IEnrolledCourseRepository, IInstructorRepository, IModuleRepository, IStudentRepository } from "../interfaces/repositoryInterfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const INSTRUCTOR_PERCENTAGE = 70;

export class StudentService implements IStudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private instructorRepository: IInstructorRepository,
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private moduleRepository: IModuleRepository,
    private enrolledCourseRepository: IEnrolledCourseRepository
  ) { }

  async signup(studentDetails: IStudent): Promise<IStudent | null> {
    try {
      const existingStudent = await this.studentRepository.findStudentByEmail(
        studentDetails.email!
      );
      if (existingStudent) {
        throw new BadRequestError("Student already exists");
      }
      return await this.studentRepository.createStudent(studentDetails);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async login(email: string): Promise<IStudent> {
    try {
      const student = await this.studentRepository.findStudentByEmail(email);
      if (!student) {
        throw new BadRequestError("User not found");
      } else {
        return student;
      }
    } catch (error) {

      console.error(error);
      throw new Error("An error occurred while logging in. Please try again.");
    }
  }

  async verifyStudent(email: string): Promise<IStudent> {
    try {
      return await this.studentRepository.updateUserVerification(email);
    } catch (error) {
      console.error(error);
      throw new Error(
        "An error occurred while verifying the student. Please try again."
      );
    }
  }

  async getUserByEmail(email: string): Promise<IStudent | null> {
    try {
      return await this.studentRepository.findStudentByEmail(email);
    } catch (error) {
      console.error(error);
      throw new Error(
        "An error occurred while fetching the user by email. Please try again."
      );
    }
  }

  async findStudentById(studentId: string): Promise<IStudent | null> {
    try {
      return await this.studentRepository.findStudentById(studentId);
    } catch (error) {
      console.error(error);
      throw new Error(
        "An error occurred while fetching the student by ID. Please try again."
      );
    }
  }

  async updateStudent(studentData: IStudent): Promise<IStudent> {
    try {
      return await this.studentRepository.updateStudent(studentData);
    } catch (error) {
      console.error(error);
      throw new Error(
        "An error occurred while updating the student. Please try again."
      );
    }
  }

  async updateImage(
    studentId: string,
    file: Express.Multer.File
  ): Promise<IStudent> {
    try {

      const student = await this.studentRepository.findStudentById(studentId);

      if (student && student.image) {
        const fileName = decodeURIComponent(
          student.image.split("/").pop()!.trim()
        );
        const existingImage = {
          Bucket: "synapsebucket-aws",
          Key: `profile-images/${fileName}`,
        };
        await s3.send(new DeleteObjectCommand(existingImage));
      }


      const key = `profile-images/${file.originalname}`;
      const params = {
        Bucket: "synapsebucket-aws",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;


      await s3.send(new PutObjectCommand(params));

      return await this.studentRepository.updateImage(studentId, filePath);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't upload profile image");
    }
  }
  async getAllCourses(
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
    try {
      const result = await this.courseRepository.getAllCourses(page);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching the courses");
    }
  }

  async getCoursesByCategoryId(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: ICourse[]; total: number }> {
    try {
      if (!categoryId) {
        throw new Error("Category ID is required");
      }
      const result = await this.courseRepository.getCoursesByCategory(
        categoryId,
        page,
        limit
      );
      if (!result) {
        return { courses: [], total: 0 };
      }
  
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching courses by category");
    }
  }
  

  async getAllCategories(): Promise<ICategory[] | null> {
    try {
      const categories = await this.categoryRepository.getAllCategories();
      return categories;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching categories");
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse> {
    try {
      const course = await this.courseRepository.getSingleCourseForInstructor(
        courseId
      );
      if (!course) {
        throw new NotFoundError("Course not found");
      }
      return course;
    } catch (error) {
      console.error(error);
      throw new Error(
        `An error occurred while fetching course with ID ${courseId}`
      );
    }
  }

  async searchCourse(details: ISearch): Promise<ICourse[] | null> {
    try {
      const courses = await this.courseRepository.searchCoursesForStudents(
        details
      );
      return courses;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while searching for courses");
    }
  }
  async updatePassword(studentId: string, password: string): Promise<IStudent> {
    try {
      const updatedStudent = await this.studentRepository.updatePassword(
        studentId,
        password
      );
      if (!updatedStudent) {
        throw new Error("Password update failed. Student not found.");
      }
      return updatedStudent;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while updating the password");
    }
  }
  
  async resetForgotPassword(
    email: string,
    password: string
  ): Promise<IStudent> {
    try {
      // Find the student by email
      const student = await this.studentRepository.findStudentByEmail(email);
      if (!student) {
        throw new BadRequestError("Student not found");
      }
      const updatedStudent = await this.studentRepository.updatePassword(
        student.id!,
        password
      );
      if (!updatedStudent) {
        throw new Error("Failed to update password. Please try again.");
      }
  
      return updatedStudent;
    } catch (error) {
      console.error(error);

      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new Error("An error occurred while resetting the password");
    }
  }
  

  async stripePayment(courseId: string, studentId: string): Promise<string> {
    try {
      const course = await this.courseRepository.findCourseById(courseId);
      const existingEnrollment =
        await this.enrolledCourseRepository.checkEnrolledCourse(
          courseId,
          studentId
        );

      if (existingEnrollment) {
        throw new BadRequestError("Already Enrolled");
      }

      if (!course) {
        throw new BadRequestError("Course not found");
      }

      const payment = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.name as string,
              },
              unit_amount: course.price! * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.ORIGIN}/status?success=true&courseId=${courseId}`,
        cancel_url: `${process.env.ORIGIN}/status`,
      });

      return payment.url!;
    } catch (error) {
      console.error("Stripe payment error:", error);
      throw new Error("An error occurred during the payment process");
    }
  }

  async enrollCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse> {
    try {
      const existingEnrolledCourse =
        await this.enrolledCourseRepository.checkEnrolledCourse(
          courseId,
          studentId
        );

      if (existingEnrolledCourse) {
        throw new BadRequestError("Course already enrolled");
      }

      const course = await this.courseRepository.findCourseById(courseId);

      if (!course) {
        throw new BadRequestError("Course not found");
      }

      await this.studentRepository.courseEnroll(studentId, courseId);

      const courseDetails = {
        courseId,
        studentId,
        price: course?.price,
      };

      const enrolledCourse = await this.enrolledCourseRepository.createCourse(
        courseDetails
      );

      const instructorAmount = (course!.price! * INSTRUCTOR_PERCENTAGE) / 100;
      const description = `Enrollment fee of ${course?.name} (ID: ${course?.id})`;

      if (course) {
        await this.instructorRepository.addToWallet(
          course.instructor!,
          instructorAmount
        );
        await this.instructorRepository.addWalletHistory(
          course.instructor!,
          instructorAmount,
          description
        );
        await this.courseRepository.incrementEnrolledCount(courseId);
      }

      return enrolledCourse;
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw new Error("An error occurred during the course enrollment process");
    }
  }

  async getEnrolledCourse(
    studentId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    try {
      const enrolledCourse =
        await this.enrolledCourseRepository.getCourseByStudentIdAndCourseId(
          studentId,
          courseId
        );

      return enrolledCourse;
    } catch (error) {
      console.error("Error fetching enrolled course:", error);
      throw new Error("An error occurred while fetching the enrolled course");
    }
  }

  async getAllEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]> {
    try {
      const enrolledCourses =
        await this.enrolledCourseRepository.getEnrolledCoursesByStudent(
          studentId
        );
      return enrolledCourses;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw new Error("An error occurred while fetching enrolled courses");
    }
  }

  async addProgression(
    enrollmentId: string,
    chapterTitle: string
  ): Promise<IEnrolledCourse> {
    const response = await this.enrolledCourseRepository.addModuleToProgression(
      enrollmentId,
      chapterTitle
    );

    return response;
  }

  async getTotalChapterCountByCourseId(courseId: string): Promise<number> {
    return await this.moduleRepository.getTotalChapterCount(courseId);
  }
}
