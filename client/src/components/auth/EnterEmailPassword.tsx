import React, { useState, ChangeEvent, FormEvent } from "react";
import { resendOtp, instructorResendOtp } from "../../api/authentication";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const EnterMailForgotPasswordForm: React.FC<{ isInstructor: boolean }> = (
  props
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErr("");
    setEmail(e.target.value.trim());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setErr("");
    e.preventDefault();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(email)) {
      dispatch(userActions.setEmail(email));
      if (props.isInstructor) {
        await instructorResendOtp(email);
        navigate("/instructor/forgot-password-otp-verfication");
      } else {
        await resendOtp(email);
        navigate("/forgot-password-otp-verfication");
      }
    } else {
      setErr("Enter a valid email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 font-sans text-center mb-4 italic">
          Enter your registered email id
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter Email"
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none transition duration-150 ease-in-out"
          />

          {err && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-md p-2 mt-2">
              {err}
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

export default EnterMailForgotPasswordForm;
