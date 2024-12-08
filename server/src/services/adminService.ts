import ErrorHandler from "../utils/ErrorHandler";
import { IAdminService } from "../interfaces/serviceInterfaces/IAdminService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { BadRequestError } from "../constants/errors/badrequestError";
import {
  ICategory,
  IStudent,
  IInstructor,
  ICourse,
  IEnrolledCourse,
  CourseApproval,
  IAdmin,
  AdminDashboardData,
  FetchSalesDataResponse,
} from "../interfaces/entityInterface";
import { IAdminRepository,ICategoryRepository,IStudentRepository,IInstructorRepository,ICourseRepository,IEnrolledCourseRepository } from "../interfaces/repositoryInterfaces"; 

export class AdminService implements IAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private categoryRepository: ICategoryRepository,
    private studentRepository: IStudentRepository,
    private instructorRepository: IInstructorRepository,
    private courseRepository: ICourseRepository,
    private enrolledCourseRepository: IEnrolledCourseRepository
  ) { }

  async login(email: string): Promise<IAdmin> {
    try {
      const admin = await this.adminRepository.findAdminByEmail(email);
      if (!admin) {
        throw new ErrorHandler("Admin Not Found", STATUS_CODES.BAD_REQUEST);
      }
      return admin;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error logging in", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCategories(): Promise<ICategory[] | null> {
    try {
      return await this.categoryRepository.getAllCategories();
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching categories", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async addCategory(category: string): Promise<ICategory | null> {
    try {
      if (await this.categoryRepository.findCategoryByName(category)) {
        throw new BadRequestError("Category already exists");
      }
      return await this.categoryRepository.createCategory(category);
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error adding category", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
  

  async editCategory(categoryId: string, data: { category: string }): Promise<ICategory> {
    try {
      return await this.categoryRepository.updateCategory(categoryId, data.category);
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error editing category", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async listCategory(categoryId: string): Promise<ICategory> {
    try {
      return await this.categoryRepository.listCategory(categoryId);
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error listing category", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async unlistCategory(categoryId: string): Promise<ICategory> {
    try {
      return await this.categoryRepository.unlistCategory(categoryId);
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error unlisting category", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllStudents(): Promise<IStudent[] | null> {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching students", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllInstructors(): Promise<IInstructor[] | null> {
    try {
      return await this.instructorRepository.getAllInstructors();
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching instructors", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async blockStudent(studentId: string): Promise<IStudent> {
    try {
      const student = await this.studentRepository.blockStudent(studentId);
  
      if (!student) {
        throw new ErrorHandler("Student not found", STATUS_CODES.NOT_FOUND);
      }
  
      return student;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error blocking student", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
  

  async unblockStudent(studentId: string): Promise<IStudent> {
    try {
      const student = await this.studentRepository.unblockStudent(studentId);
  
      if (!student) {
        throw new ErrorHandler("Student not found", STATUS_CODES.NOT_FOUND);
      }
  
      return student;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error unblocking student", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
  

  async blockInstructor(instructorId: string): Promise<IInstructor> {
    try {
      const instructor = await this.instructorRepository.blockInstructor(instructorId);
  
      if (!instructor) {
        throw new ErrorHandler("Instructor not found", STATUS_CODES.NOT_FOUND);
      }
  
      return instructor;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error blocking instructor", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
  async unblockInstructor(instructorId: string): Promise<IInstructor> {
    try {
      const instructor = await this.instructorRepository.unblockInstructor(instructorId);
  
      if (!instructor) {
        throw new ErrorHandler("Instructor not found", STATUS_CODES.NOT_FOUND);
      }
  
      return instructor;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error unblocking instructor", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
    
  async getAllCourses(): Promise<ICourse[]> {
    try {
      return await this.courseRepository.getCourseByAdmin();
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching courses", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse> {
    try {
      const course = await this.courseRepository.getSingleCourseForAdmin(courseId);
      if (!course) {
        throw new BadRequestError("Course not found");
      }
      return course;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching course", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async courseApproval(
    courseId: string,
    approval: CourseApproval
  ): Promise<ICourse> {
    try {
      return await this.courseRepository.courseApproval(courseId, approval);
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error approving course", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async adminDashboardData(): Promise<AdminDashboardData> {
    try {
      const totalRevenue = await this.enrolledCourseRepository.getTotalRevenue();
      const instructorCount = await this.instructorRepository.getInstructorCount();
      const studentCount = await this.studentRepository.getStudentCount();
      const courseCount = await this.courseRepository.getCourseCount();

      return { totalRevenue, instructorCount, studentCount, courseCount };
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching dashboard data", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async getEnrolledCoursesByAdmin(): Promise<IEnrolledCourse[] | null> {
    try {
      const enrolledCourses = await this.enrolledCourseRepository.getEnrolledCoursesByAdmin();
      if (!enrolledCourses) {
        throw new BadRequestError("No enrollment");
      }
      return enrolledCourses;
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching enrolled courses", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchSalesData(
    filter: "weekly" | "monthly" | "yearly"
  ): Promise<FetchSalesDataResponse> {
    try {
      const salesData = await this.enrolledCourseRepository.getRevenueData(filter);
      return { data: salesData };
    } catch (error) {
      console.error(error);
      throw new ErrorHandler("Error fetching sales data", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
