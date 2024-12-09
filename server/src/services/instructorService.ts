import { IInstructorService } from "../interfaces/serviceInterfaces/IInstructorService";
import {
  IInstructor,
  ICourse,
  IModule,
  IChapter,
  IEnrolledCourse,
  ICategory,
} from "../interfaces/entityInterface";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import ErrorHandler from "../utils/ErrorHandler";
import { BadRequestError } from "../constants/errors/badrequestError";
import s3, { uploadToS3 } from "../config/awsS3.config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  ICategoryRepository,
  ICourseRepository,
  IEnrolledCourseRepository,
  IInstructorRepository,
  IModuleRepository,
} from "../interfaces/repositoryInterfaces";

const { BAD_REQUEST } = STATUS_CODES;

export class InstructorService implements IInstructorService {
  constructor(
    private InstructorRepository: IInstructorRepository,
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private moduleRepository: IModuleRepository,
    private enrolledCourseRepository: IEnrolledCourseRepository
  ) {}

  async signup(InstructorData: IInstructor): Promise<IInstructor | null> {
    try {
      const existingInstructor =
        await this.InstructorRepository.findInstructorByEmail(
          InstructorData.email!
        );
      if (existingInstructor) {
        throw new ErrorHandler("Instructor already exists", BAD_REQUEST);
      } else {
        return await this.InstructorRepository.createInstructor(InstructorData);
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't complete Signup process");
    }
  }

  async login(email: string): Promise<IInstructor> {
    try {
      const instructor = await this.InstructorRepository.findInstructorByEmail(
        email
      );
      if (!instructor) {
        throw new ErrorHandler("Instructor not found", BAD_REQUEST);
      }
      return instructor;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't complete login process");
    }
  }

  async verifyInstructor(email: string): Promise<IInstructor> {
    try {
      return await this.InstructorRepository.updateInstructorVerification(
        email
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't verify instructor");
    }
  }

  async findInstructorById(instructorId: string): Promise<IInstructor | null> {
    try {
      return await this.InstructorRepository.findInstructorById(instructorId);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't find instructor by ID");
    }
  }

  async updateInstructor(instructorData: IInstructor): Promise<IInstructor> {
    try {
      return await this.InstructorRepository.updateInstructor(instructorData);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't update instructor details");
    }
  }

  async updateInstructorImage(
    instructorId: string,
    file: Express.Multer.File
  ): Promise<IInstructor> {
    try {
      const instructor = await this.InstructorRepository.findInstructorById(
        instructorId
      );
      if (instructor && instructor.image) {
        const fileName = decodeURIComponent(
          instructor.image.split("/").pop()!.trim()
        );
        const existingImage = {
          Bucket: "synapsebucket-aws",
          Key: `instructor-profile/${fileName}`,
        };
        await s3.send(new DeleteObjectCommand(existingImage));
      }

      const key = `instructor-profile/${file.originalname}`;
      const params = {
        Bucket: "synapsebucket-aws",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

      await s3.send(new PutObjectCommand(params));

      return await this.InstructorRepository.updateInstructorImage(
        instructorId,
        filePath
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't upload profile image");
    }
  }
  async getMyCourses(
    instructorId: string,
    page: number
  ): Promise<{ courses: ICourse[]; totalCount: number } | null> {
    try {
      return await this.courseRepository.getCourseByInstructor(
        instructorId,
        page
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't fetch courses for the instructor");
    }
  }

  async getSingleCourse(courseId: string): Promise<ICourse | null> {
    try {
      const course = await this.courseRepository.getSingleCourseForInstructor(
        courseId
      );
      return course;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't fetch the course details");
    }
  }

  async updateCourse(
    courseId: string,
    courseDetails: ICourse,
    file?: Express.Multer.File
  ): Promise<ICourse> {
    try {
      const existingCourse =
        await this.courseRepository.getSingleCourseForInstructor(courseId);

      if (existingCourse && existingCourse.image) {
        const fileName = decodeURIComponent(
          existingCourse.image.split("/").pop()!.trim()
        );
        const existingImage = {
          Bucket: "synapsebucket-aws",
          Key: `courses/${existingCourse.name!.replace(
            /\s/g,
            "_"
          )}/image/${fileName}`,
        };
        await s3.send(new DeleteObjectCommand(existingImage));
      }

      let filePath: string | undefined;

      if (file) {
        const sanitizedCourseName = courseDetails.name!.replace(/\s/g, "_");
        const sanitizedFileName = encodeURIComponent(file.originalname);

        const key = `courses/${sanitizedCourseName}/image/${sanitizedFileName}`;
        const params = {
          Bucket: "synapsebucket-aws",
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;

        await s3.send(new PutObjectCommand(params));
      }

      const updatedCourseData = {
        ...courseDetails,
        image: filePath || existingCourse!.image,
      };

      return await this.courseRepository.updateCourse(
        courseId,
        updatedCourseData
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't update course image");
    }
  }

  async deleteCourse(courseId: string): Promise<ICourse> {
    try {
      return await this.courseRepository.unlistCourse(courseId);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't delete the course");
    }
  }

  async listCourse(courseId: string): Promise<ICourse> {
    try {
      return await this.courseRepository.listCourse(courseId);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't list the course");
    }
  }

  async getAllCategories(): Promise<ICategory[] | null> {
    try {
      return await this.categoryRepository.getListedCategories();
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't fetch categories");
    }
  }

  async createModule(moduleDetails: IModule, order: number): Promise<IModule> {
    try {
      const { name, courseId } = moduleDetails;

      const module = {
        name,
        courseId,
      };
      const newModule = await this.moduleRepository.createModule(module);
      await this.courseRepository.addModule(courseId!, {
        module: newModule.id!,
        order,
      });

      return newModule;
    } catch (error) {
      console.log(error);

      throw new BadRequestError("Error in upload video");
    }
  }

  async createCourse(
    courseDetails: ICourse,
    file: Express.Multer.File
  ): Promise<ICourse> {
    try {
      const createdCourse = await this.courseRepository.createCourse(
        courseDetails
      );

      if (file) {
        const sanitizedCourseName = createdCourse.name!.replace(/\s/g, "_");
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

        await s3.send(new PutObjectCommand(params));

        if (createdCourse.id) {
          return await this.courseRepository.addCourseImage(
            createdCourse.id,
            filePath
          );
        }
      }
      return createdCourse;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't create course or upload image");
    }
  }

  async updateModule(
    moduleId: string,
    updateData: Partial<IModule>
  ): Promise<IModule | null> {
    try {
      return await this.moduleRepository.updateModule(moduleId, updateData);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't update module");
    }
  }

  async deleteModule(moduleId: string): Promise<IModule | null> {
    try {
      return await this.moduleRepository.deleteModule(moduleId);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't delete module");
    }
  }

  async addChapter(
    moduleId: string,
    chapterData: IChapter,
    file: Express.Multer.File
  ): Promise<IModule | null> {
    try {
      const module = await this.moduleRepository.findModuleById(moduleId);
      if (!module) {
        throw new BadRequestError("Module not found");
      }
      const fileKey = await uploadToS3(file);
      console.log("File key:", fileKey);

      const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
      chapterData.videoUrl = videoUrl;
      console.log("ChapterDataVideoUrl:", chapterData.videoUrl);

      console.log("Attempting to update module with ID:", moduleId);
      return await this.moduleRepository.addChapter(moduleId, chapterData);
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't add chapter to module");
    }
  }

  async resetForgotPassword(
    email: string,
    password: string
  ): Promise<IInstructor> {
    try {
      const instructor = await this.InstructorRepository.findInstructorByEmail(
        email
      );
      if (!instructor) {
        throw new BadRequestError("Instructor not found");
      }
      return await this.InstructorRepository.updatePassword(
        instructor.id!,
        password
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Couldn't reset password");
    }
  }

  async getEnrolledCoursesByInstructor(
    instructorId: string
  ): Promise<IEnrolledCourse[] | null> {
    try {
      const enrolledCourses =
        await this.enrolledCourseRepository.getEnrolledCoursesByInstructor(
          instructorId
        );

      if (!enrolledCourses) {
        throw new BadRequestError("No enrollment found");
      }
      return enrolledCourses;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Failed to fetch enrolled courses");
    }
  }
}
