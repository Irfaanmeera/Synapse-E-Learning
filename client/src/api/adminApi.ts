/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authorizedAxios } from "./config";
import axios from "axios";

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

const getAllStudents = async () => {
  try {
    const students = await authorizedAxios.get("/admin/getStudents");
    if (students) {
      return Promise.resolve(students.data.students);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAllInstructors = async () => {
  try {
    const instructors = await authorizedAxios.get("/admin/getInstructors");
    if (instructors) {
      return Promise.resolve(instructors.data.instructors);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const blockStudent = async (studentId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/blockStudent", {
      studentId,
    });
    console.log("Response in block api:", response);
    const { success } = response.data;
    if (success) {
      return Promise.resolve(success);
    }
  } catch (error) {
    return Promise.reject();
  }
};

const blockInstructor = async (instructorId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/blockInstructor", {
      instructorId,
    });
    const { success } = response.data;
    if (success) {
      return Promise.resolve(success);
    }
  } catch (error) {
    return Promise.reject();
  }
};

const unblockStudent = async (studentId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/unblockStudent", {
      studentId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return Promise.reject();
  }
};
const unblockInstructor = async (instructorId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/unblockInstructor", {
      instructorId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return Promise.reject();
  }
};
const fetchCoursesByAdmin = async () => {
  try {
    const response = await authorizedAxios.get("/admin/courses");
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching courses for admin:", error);
    throw error;
  }
};
const updateCourseApproval = async (courseId: string, approval: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/courseApproval", {
      courseId,
      approval,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update course approval:", error);
    throw error;
  }
};
const getSingleCourse = async (courseId: string) => {
  try {
    const response = await authorizedAxios.get(`/admin/course/${courseId}`);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject();
  }
};
const fetchCategories = async () => {
  try {
    const response = await authorizedAxios.get("/admin/categories");
    const { categories } = response.data;
    return Promise.resolve(categories);
  } catch (error) {
    return Promise.reject();
  }
};

const addCategory = async (categoryName: string) => {
  try {
    const response = await authorizedAxios.post("/admin/addCategory", {
      category: categoryName,
    });
    const { category } = response.data;
    console.log("Category Response", category);
    return Promise.resolve(category);
  } catch (error) {
    return Promise.reject();
  }
};

const editCategory = async (categoryId: string, data: string) => {
  try {
    const response = await authorizedAxios.put("/admin/category", {
      categoryId,
      data,
    });
    const { category } = response.data;
    console.log("Category in frontend", category);
    return Promise.resolve(category);
  } catch (error) {
    return handleAxiosError(error);
  }
};

const listCategory = async (categoryId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/listCategory", {
      categoryId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return handleAxiosError(error);
  }
};

const unlistCategory = async (categoryId: string) => {
  try {
    const response = await authorizedAxios.patch("/admin/unlistCategory", {
      categoryId,
    });
    const { success } = response.data;

    return Promise.resolve(success);
  } catch (error) {
    return handleAxiosError(error);
  }
};

const adminDashboard = async () => {
  try {
    const response = await authorizedAxios.get("/admin/dashboard");
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject();
  }
};
const fetchEnrolledCourses = async () => {
  try {
    const response = await authorizedAxios.get(`/admin/enrolledCourses`);
    console.log("Fetch enrolled courses Response:", response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
};
const fetchSalesData = async (filter: "weekly" | "monthly" | "yearly") => {
  const response = await authorizedAxios.get(
    `/admin/salesData?filter=${filter}`
  );
  console.log("sales data", response.data.data);
  return Promise.resolve(response.data.data);
};
export {
  getAllStudents,
  blockStudent,
  unblockStudent,
  getAllInstructors,
  blockInstructor,
  unblockInstructor,
  fetchCoursesByAdmin,
  updateCourseApproval,
  getSingleCourse,
  adminDashboard,
  fetchEnrolledCourses,
  fetchSalesData,
  addCategory,
  fetchCategories,
  listCategory,
  unlistCategory,
  editCategory,
};
