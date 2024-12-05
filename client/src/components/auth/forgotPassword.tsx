/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  updateStudentForgotPassword,
  updateInstructorForgotPassword,
} from "../../api/authentication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { forgotPasswordSchema } from "../../validations/forgotPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/userSlice";

interface Credentials {
  password: string;
  confirmpassword: string;
}

const ForgotPassword: React.FC<{ isInstructor: boolean }> = ({
  isInstructor,
}) => {
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((store: RootState) => store.user.userEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const submitData = async (data: Credentials) => {
    setErr("");
    console.log(userEmail);

    try {
      if (!isInstructor) {
        const response = await updateStudentForgotPassword(
          userEmail!,
          data.password
        );
        console.log(response);

        if (response) {
          setSuccess("Password updated successfully");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setErr("Error in changing password");
        }
      } else {
        const response = await updateInstructorForgotPassword(
          userEmail!,
          data.password
        );
        if (response) {
          setSuccess("Password updated successfully");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setErr("Error in changing password");
        }
      }
    } catch (error) {
      if (typeof error === "string") {
        setErr(error);
      } else {
        setErr("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(submitData)} className="space-y-4">
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter your new password below.
          </p>
          <input
            type="password"
            {...register("password")}
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none transition duration-150 ease-in-out"
          />
          {errors.password && (
            <span className="text-red-600 text-sm italic">
              *{errors.password.message}
            </span>
          )}
          <input
            type="password"
            {...register("confirmpassword")}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none transition duration-150 ease-in-out"
          />
          {errors.confirmpassword && (
            <span className="text-red-600 text-sm italic">
              *{errors.confirmpassword.message}
            </span>
          )}
          {err && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-md p-2 mt-2">
              {err}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center bg-green-50 rounded-md p-2 mt-2">
              {success}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-Blueviolet text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 ease-in-out hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
