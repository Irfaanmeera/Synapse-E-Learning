/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEnrolledCourse } from "../interfaces/entityInterface/IEnrolledCourse";
import { IEnrolledCourseRepository } from "../interfaces/repositoryInterfaces/IEnrolledCourseRepository";
import { EnrolledCourse } from "../models/enrolledCourse";
import { BadRequestError } from "../constants/errors/badrequestError";

export class EnrolledCourseRepository implements IEnrolledCourseRepository {
  async createCourse(courseDetails: IEnrolledCourse): Promise<IEnrolledCourse> {
    const enrollCourse = EnrolledCourse.build(courseDetails);
    return await enrollCourse.save();
  }

  async getCourseById(courseId: string): Promise<IEnrolledCourse> {
    const enrolledCourse = await EnrolledCourse.findById(courseId).populate({
      path: "courseId",
      populate: {
        path: "modules.module",
        model: "module",
      },
    });

    if (!enrolledCourse) {
      throw new BadRequestError("Course not found");
    }
    return enrolledCourse;
  }
  async getCourseByStudentIdAndCourseId(
    studentId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    const result = await EnrolledCourse.findOne({
      studentId,
      courseId,
    }).populate({
      path: "courseId",
      populate: {
        path: "modules.module",
        model: "module",
      },
    });
    return result;
  }

  async getEnrolledCoursesByStudent(
    studentId: string
  ): Promise<IEnrolledCourse[]> {
    const enrolledCourses = EnrolledCourse.find({ studentId }).populate({
      path: "courseId",
      populate: [
        { path: "modules.module", model: "module" },
        { path: "category", model: "category" },
        { path: "instructor", model: "instructor", select: "name" },
      ],
    });
    if (!enrolledCourses) {
      throw new BadRequestError("Enrollment not found");
    }
    return enrolledCourses;
  }
  async getEnrolledCoursesByInstructor(
    instructorId: string
  ): Promise<IEnrolledCourse[]> {
    const enrolledCourses = await EnrolledCourse.find({})
      .populate({
        path: "courseId",
        match: { instructor: instructorId },
        populate: [
          { path: "modules.module", model: "module" },
          { path: "category", model: "category" },
          { path: "instructor", model: "instructor" },
        ],
      })
      .populate("studentId")
      .sort({ createdAt: -1 });

    const filteredEnrolledCourses = enrolledCourses.filter(
      (enrolledCourse) => enrolledCourse.courseId !== null
    );

    if (!filteredEnrolledCourses.length) {
      throw new Error("No enrolled courses found for this instructor.");
    }

    return filteredEnrolledCourses;
  }

  async getEnrolledCoursesByCourseId(
    courseId: string
  ): Promise<IEnrolledCourse[]> {
    return await EnrolledCourse.find({ courseId }).populate("studentId");
  }

  async checkEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null> {
    return await EnrolledCourse.findOne({ studentId, courseId });
  }

  async addModuleToProgression(
    enrollmentId: string,
    chapterTitle: string
  ): Promise<IEnrolledCourse> {
    const course = await EnrolledCourse.findById(enrollmentId);

    if (!course) {
      throw new BadRequestError("Enrollment not found");
    }
    if (!course.progression?.includes(chapterTitle)) {
      course.progression?.push(chapterTitle);
    }
    const updatedCourse = await course.save();

    return updatedCourse;
  }

  async completedStatus(enrolledId: string): Promise<void> {
    const course = await EnrolledCourse.findById(enrolledId);
    if (course) {
      course.set({ completed: true });
    }
    await course?.save();
  }
  async getEnrolledCoursesByAdmin(): Promise<IEnrolledCourse[]> {
    const enrolledCourses = await EnrolledCourse.find({})
      .populate({
        path: "courseId",
        populate: [
          { path: "modules.module", model: "module" },
          { path: "category", model: "category" },
          { path: "instructor", model: "instructor" },
        ],
      })
      .populate("studentId")
      .sort({ createdAt: -1 });

    if (!enrolledCourses.length) {
      throw new Error("No enrolled courses found.");
    }

    return enrolledCourses;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await EnrolledCourse.aggregate([
      {
        $match: {
          status: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getRevenueData(filter: "weekly" | "monthly" | "yearly") {
    const date = new Date();
    let startDate: Date, groupFormat: any;

    switch (filter) {
      case "weekly":
        startDate = new Date(date.setDate(date.getDate() - 7));
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      case "monthly":
        startDate = new Date(date.setMonth(date.getMonth() - 12));
        groupFormat = { $month: "$createdAt" };
        break;
      case "yearly":
        startDate = new Date(date.setFullYear(date.getFullYear() - 5));
        groupFormat = { $year: "$createdAt" };
        break;
      default:
        throw new Error("Invalid filter type");
    }

    const revenueData = await EnrolledCourse.aggregate([
      {
        $match: {
          status: true,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return revenueData;
  }
}
