/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin } from "../interfaces/Admin";
import { Instructor } from "../interfaces/Instructor";
import { User } from "../interfaces/User";
import { axiosInstance } from "./config";
import axios from "axios";
// import {socket} from '../components/socket/Socket'

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    if (
      axiosError.response &&
      axiosError.response.data &&
      axiosError.response.data.message
    ) {
      console.error("Backend error message:", axiosError.response.data.message);
      return Promise.reject(axiosError.response.data.message); // Display backend error
    }
  }
  return Promise.reject("An unexpected error occurred."); // Fallback message
};

const studentSignup = async (
  studentData: User
): Promise<{ success: boolean; email: string } | undefined> => {
  try {
    const response = await axiosInstance.post("/signup", studentData);
    const { message, email } = response.data;

    console.log("Submitting data:", response.data);

    if (message === "OTP sent for verification...") {
      return { success: true, email };
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};

const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.post("/verifyOtp", { otp, email });
    const { token, refreshToken, student } = response.data;
    console.log(response);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return student;
  } catch (error) {
    return handleAxiosError(error);
  }
};

const resendOtp = async (email: string) => {
  try {
    await axiosInstance.post("/resendOtp", { email });
    return Promise.resolve("OTP resent successfully.");
  } catch (error) {
    return handleAxiosError(error);
  }
};

const studentLogin = async (studentData: User) => {
  try {
    const response = await axiosInstance.post("/login", studentData);
    const { token, refreshToken, student } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    return student;
  } catch (error) {
    console.error("Error during login:", error);
    return handleAxiosError(error);
  }
};

const googleLogin = async (
  name: string | null,
  email: string | null,
  photoUrl: string | null
) => {
  try {
    if (!name || !email) return;
    const result = await axiosInstance.post("/google-login", {
      name,
      email,
      photoUrl,
    });
    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("Error occurred:", error);
    console.log("Error coming from here...");
  }
};


const instructorSignup = async (
  instructorData: Instructor
): Promise<{ success: boolean; email: string } | undefined> => {
  try {
    const response = await axiosInstance.post(
      "instructor/signup",
      instructorData
    );
    const { message, email } = response.data;

    console.log("Submitting data:", response.data);

    if (message === "OTP sent for verification...") {
      return { success: true, email };
    }
  } catch (error) {
    return handleAxiosError(error);
  }
};

const instructorVerifyOtp = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.post("instructor/verifyOtp", {
      otp,
      email,
    });
    const { token, refreshToken, instructor } = response.data;
    console.log(response);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return instructor;
  } catch (error) {
    return handleAxiosError(error);
  }
};

const instructorResendOtp = async (email: string) => {
  try {
    await axiosInstance.post("instructor/resendOtp", { email });
    return Promise.resolve("OTP resent successfully.");
  } catch (error) {
    return handleAxiosError(error);
  }
};

const instructorLogin = async (instructorData: Instructor) => {
  try {
    const response = await axiosInstance.post(
      "instructor/login",
      instructorData
    );
    const { token, refreshToken, instructor } = response.data;
    console.log("Instructor Info:", response.data);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return instructor;
  } catch (error) {
    console.error("Error during login:", error);
    return handleAxiosError(error);
  }
};
const adminLogin = async (adminData: Admin) => {
  try {
    const response = await axiosInstance.post("admin/login", adminData);
    const { token, refreshToken, admin } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    return admin;
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error);
  }
};

const userLogout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const updateInstructorForgotPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post("/instructor/forgot-password", {
      email,
      password,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error);
  }
};

const InstructorOtpVerfication = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post<{ success: boolean }>(
      "/instructor/verify-forgot-password-otp",
      { email, otp }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error);
  }
};
const updateStudentForgotPassword = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/forgot-password", {
      email,
      password,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error);
  }
};
const studentOtpVerfication = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post<{ success: boolean }>(
      "/verify-forgot-password-otp",
      {
        email,
        otp,
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error during login:", error);
    return await handleAxiosError(error);
  }
};

export {
  studentSignup,
  verifyOtp,
  resendOtp,
  studentLogin,
  googleLogin,
  userLogout,
  instructorResendOtp,
  instructorSignup,
  instructorVerifyOtp,
  instructorLogin,
  adminLogin,
  InstructorOtpVerfication,
  updateInstructorForgotPassword,
  studentOtpVerfication,
  updateStudentForgotPassword,
};
