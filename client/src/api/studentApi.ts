/* eslint-disable @typescript-eslint/no-explicit-any */
import { authorizedAxios, axiosInstance } from "./config";
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

const updateUser = async (data: { name: string }) => {
  try {
    const response = await authorizedAxios.put("/updateUser", data);
    console.log(response.data);

    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};

const updateImage = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await authorizedAxios.put("/updateImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    if (response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject("Upload Image Failed");
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};
const getCourses = async (page: number, categoryId: string): Promise<any> => {
  try {
    const response = await authorizedAxios.get("/coursesByCategory", {
      params: { page, categoryId },
    });
    console.log("response category response", response.data);

    if (response && response.data) {
      console.log("Category Response:", response.data);
      return response.data;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return handleAxiosError(error);
  }
};

const searchCourse = async (searchKey: string) => {
  try {
    const response = await axiosInstance.get(
      `/searchCourse?search=${searchKey}`
    );

    console.log("REsponse data for search", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllCourses = async (page: number) => {
  try {
    const response = await axiosInstance.get(`/courses?page=${page}`);
    console.log("CoursesApi", response.data);

    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};
const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    console.log(response.data);

    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};
const getSingleCourse = async (courseId: string | undefined) => {
  try {
    const response = await authorizedAxios.get(`/course/${courseId}`);
    console.log(response);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const courseEnroll = async (courseId: string) => {
  try {
    const response = await authorizedAxios.post("/createPayment", { courseId });
    console.log("Course enroll response: ", response.data);
    if (response.data) {
      return Promise.resolve(response.data.url);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const enrollment = async (courseId: string) => {
  try {
    const response = await authorizedAxios.post("/enrollcourse", { courseId });
    if (response.data) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
const getEnrolledCourse = async (courseId: string) => {
  try {
    console.log("Course id in api:", courseId);
    const response = await authorizedAxios.get(
      `/getEnrolledCourse/${courseId}`
    );
    console.log("REsponsein get enrolled course;", response.data);
    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllEnrolledCourse = async () => {
  try {
    const response = await authorizedAxios.get("/getEnrolledCoursesByStudent");
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const addProgression = async (enrollmentId: string, chapterTitle: string) => {
  try {
    const response = await authorizedAxios.get(
      `/addProgression?enrollmentId=${enrollmentId}&chapterTitle=${chapterTitle}`
    );
    console.log("Response from add progress:", response);
    if (response) {
      return Promise.resolve(response);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getTotalChapterCountByCourseId = async (courseId: string) => {
  try {
    const response = await authorizedAxios.get(
      `/totalChapterCount/${courseId}`
    );
    if (response) {
      return Promise.resolve(response.data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  updateUser,
  updateImage,
  getCourses,
  searchCourse,
  getAllCourses,
  getAllCategories,
  getSingleCourse,
  courseEnroll,
  enrollment,
  getEnrolledCourse,
  getAllEnrolledCourse,
  addProgression,
  getTotalChapterCountByCourseId,
};
