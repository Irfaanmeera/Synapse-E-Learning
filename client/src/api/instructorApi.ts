/* eslint-disable @typescript-eslint/no-explicit-any */
import { IChapter, Module } from "../interfaces/module";
import { authorizedAxios } from "./config";
import axios, { AxiosProgressEvent } from "axios";

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    if (
      axiosError.response &&
      axiosError.response.data &&
      axiosError.response.data.message
    ) {
      console.error("Backend error message:", axiosError.response.data.message);
      return Promise.reject(axiosError.response.data.message);
    }
  }
  return Promise.reject("An unexpected error occurred.");
};

const updateInstructor = async (data: { name: string }) => {
  try {
    const response = await authorizedAxios.put(
      "instructor/updateInstructor",
      data
    );
    console.log("Update Resposne :", response.data);

    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};

const updateInstructorImage = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await authorizedAxios.put(
      "instructor/updateImage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );
    if (response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject("Upload Image Failed");
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};

const deleteCourse = async (courseId: string | undefined) => {
  try {
    const response = await authorizedAxios.patch(
      `/instructor/deleteCourse/${courseId}`
    );

    if (response.data) {
      return Promise.resolve(response.data);
    }
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return handleAxiosError(error);
  }
};
const listCourse = async (courseId: string | undefined) => {
  try {
    const response = await authorizedAxios.patch(
      `/instructor/listCourse/${courseId}`
    );

    if (response.data) {
      return Promise.resolve(response.data);
    }
  } catch (error: any) {
    console.error("Error listing course:", error);
    return handleAxiosError(error);
  }
};
const fetchInstructorCourses = async (page: number = 1) => {
  try {
    const response = await authorizedAxios.get(`/instructor/myCourses`, {
      params: {
        page: page, // Pass the page number if pagination is needed
      },
    });

    console.log("Api response fetcjhcourse: ", response.data);
    if (response.data) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const fetchSingleCourseDetails = async (courseId: any) => {
  try {
    const response = await authorizedAxios.get(
      `/instructor/course/${courseId}`
    );
    console.log("Single course api:", response.data);
    if (response.data) {
      return Promise.resolve(response.data);
    } else {
      throw new Error("Failed to fetch course details");
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};
const createModule = async (moduleData: Module): Promise<any> => {
  try {
    const response = await authorizedAxios.post(
      "/instructor/createModule",
      moduleData
    );
    console.log("Created Module Data:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};

// API for updating a module
const updateModule = async (
  moduleId: string,
  moduleData: Partial<Module>
): Promise<any> => {
  try {
    const response = await authorizedAxios.put(
      `/instructor/updateModule/${moduleId}`,
      moduleData
    );
    console.log("Updated Module Data:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};

// API for deleting a module
const deleteModule = async (moduleId: string): Promise<any> => {
  try {
    const response = await authorizedAxios.delete(
      `/instructor/deleteModule/${moduleId}`
    );
    console.log("Deleted Module Response:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};

// API for adding a chapter to a module, including file upload to S3
const addChapter = async (
  moduleId: string | undefined,
  chapterData: IChapter,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("video", file);
    Object.keys(chapterData).forEach((key) => {
      formData.append(key, (chapterData as any)[key]);
    });

    const response = await authorizedAxios.post(
      `/instructor/modules/${moduleId}/addChapter`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );
    console.log("Added Chapter Response:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};

const fetchEnrolledStudents = async () => {
  try {
    const response = await authorizedAxios.get(
      `/instructor/getEnrolledStudents`
    );
    console.log("Fetch enrolled Students Response:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};

export {
  updateInstructor,
  updateInstructorImage,
  fetchInstructorCourses,
  deleteCourse,
  listCourse,
  fetchSingleCourseDetails,
  createModule,
  addChapter,
  deleteModule,
  updateModule,
  fetchEnrolledStudents,
};
