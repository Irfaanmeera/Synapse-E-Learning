/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { verifyOtp } from "../../api/authentication";
import { instructorVerifyOtp } from "../../api/authentication";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { userActions } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const OtpVerificationForm: React.FC<{ isInstructor: boolean }> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [resendTimer, setResendTimer] = useState(300);
  const [showButton, setShowButton] = useState(false);
  const email = useSelector((store: RootState) => store.user.userEmail);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email, "OTP:", otp);

    try {
      if (!props.isInstructor) {
        const response = await verifyOtp(otp, email!);
        console.log("OTP Verification Response:", response);
        if (response) {
          dispatch(userActions.saveUser(response));
          toast.success("OTP verification successful!");
          navigate("/");
        }
      } else {
        const response = await instructorVerifyOtp(otp, email!);
        if (response) {
          dispatch(userActions.saveUser(response));
          navigate("/instructor");
        }
      }
    } catch (error) {
      setErr("OTP verification failed");
    }
  };

  useEffect(() => {
    const resendTimeout = setTimeout(() => {
      setShowButton(true);
    }, resendTimer * 1000);

    const countdownInterval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(resendTimeout);
      clearInterval(countdownInterval);
    };
  }, [resendTimer]);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${("0" + seconds).slice(-2)}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          OTP Verification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-500 text-center mb-4">
            Please enter the OTP sent to your email.
          </p>

          <input
            type="number"
            value={otp}
            onChange={handleInputChange}
            placeholder="Enter OTP"
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
            Verify OTP
          </button>

          {showButton ? (
            <p className="text-center text-indigo-600 text-sm cursor-pointer underline mt-4">
              Resend OTP
            </p>
          ) : (
            <p className="text-center text-gray-500 text-sm mt-4">
              Resend OTP in {formatTime(resendTimer)} seconds
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
