import { Course } from "../models/courseModel";
import {
  ICourse,
  CourseApproval,
  ISearch,
} from "../interfaces/entityInterface/ICourse";
import { ICourseRepository } from "../interfaces/repositoryInterfaces/ICourseRepository";
import { NotFoundError } from "../constants/errors/notFoundError";
import { Instructor } from "../models/instructorModel";

export class CourseRepository implements ICourseRepository {
  async createCourse(courseDetails: ICourse): Promise<ICourse> {
    const course = Course.build(courseDetails);
    const savedCourse = await course.save();
    const instructorId = courseDetails.instructor;
    if (instructorId) {
      await Instructor.findByIdAndUpdate(instructorId, {
        $push: { courses: savedCourse.name },
      });
    }

    return savedCourse;
  }

  async getAllCourses(page: number): Promise<{
    courses: ICourse[];
    totalCount: number;
  } | null> {
    const LIMIT = 10;
    let skip = 0;
    if (page > 1) {
      skip = (page - 1) * LIMIT;
    }
    const courses = await Course.find()
      .skip(skip)
      .limit(LIMIT)
      .populate("category")
      .populate("level");
    const totalCount = await Course.find().countDocuments();
    return { courses, totalCount };
  }

  async getCourseByInstructor(
    instructorId: string,
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
    const LIMIT = 8;
    let skip = 0;
    if (page > 1) {
      skip = (page - 1) * LIMIT;
    }
    const courses = await Course.find({ instructor: instructorId })
      .skip(skip)
      .limit(LIMIT)
      .populate("category")
      .populate("level");
    const totalCount = await Course.find({
      instructor: instructorId,
    }).countDocuments();
    return { courses, totalCount };
  }

  async getSingleCourseForInstructor(
    courseId: string
  ): Promise<ICourse | null> {
    return await Course.findById(courseId)
      .populate("instructor")
      .populate("category")
      .populate({
        path: "modules.module",
        model: "module",
      });
  }

  async getCoursesByApproval(
    approval: CourseApproval
  ): Promise<ICourse[] | null> {
    return await Course.find({ approval });
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  }

  async updateCourse(
    courseId: string,
    courseDetails: ICourse
  ): Promise<ICourse> {
    const { name, category, description, price, image, level } = courseDetails;
    const course = await Course.findById(courseId);
    course!.set({
      name,
      category,
      description,
      image,
      price,
      level,
    });
    return await course!.save();
  }

  async addModule(
    courseId: string,
    module: { module: string; order: number }
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course?.modules?.push(module);
    return await course.save();
  }

  async getCoursesByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ courses: ICourse[]; total: number }> {
    const filter = { category: categoryId, approval: "Approved", status: true };

    const skip = (page - 1) * limit;

    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { courses, total };
  }

  async courseApproval(
    courseId: string,
    status: CourseApproval
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      approval: status,
    });
    return await course.save();
  }

  async addCourseImage(courseId: string, image: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    course!.set({
      image,
    });
    return await course!.save();
  }

  async getCourseCount(): Promise<number> {
    return await Course.countDocuments({ approval: CourseApproval.approved });
  }
  async listCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      status: true,
    });
    return await course.save();
  }

  async unlistCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    course.set({
      status: false,
    });
    return await course.save();
  }

  async getListedCourses({
    page,
    category,
  }: {
    page: number;
    category?: string;
  }): Promise<{
    courses: ICourse[];
    totalCount: number;
  } | null> {
    const condition: { category?: string; status: boolean; approval: string } =
      {
        status: true,
        approval: CourseApproval.approved,
      };
    if (category) {
      condition.category = category;
    }
    const LIMIT = 8;
    let skip = 0;
    if (page > 1) {
      skip = (page - 1) * LIMIT;
    }
    const courses = await Course.find(condition)
      .limit(LIMIT)
      .skip(skip)
      .populate("category")
      .populate("level")
      .sort({ createdAt: -1 });

    const totalCount = await Course.find(condition).countDocuments();

    return { courses, totalCount };
  }
  async incrementEnrolledCount(courseId: string): Promise<void> {
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
  }

  async getCourseByAdmin(): Promise<ICourse[]> {
    return await Course.find()
      .populate("instructor")
      .populate("category")
      .populate({
        path: "modules.module",
        model: "module",
      });
  }

  async getSingleCourseForAdmin(courseId: string): Promise<ICourse | null> {
    const course = await Course.findById(courseId)
      .populate("instructor")
      .populate("category")
      .populate({
        path: "modules.module",
        model: "module",
      });
    return course;
  }
  async searchCoursesForStudents(details: ISearch): Promise<ICourse[] | null> {
    const course = await Course.find({ approval: "Approved", ...details });
    return course;
  }
}
