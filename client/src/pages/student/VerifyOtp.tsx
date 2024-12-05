import React from "react";
import OtpVerification from "../../components/auth/OtpVerification";
import ForgotPasswordOtpVerificationForm from "../../components/auth/ForgotPasswordOtp";


const VerifyOtp: React.FC<{
  isInstructor: boolean;
  isForgotPassword: boolean;
}> = (props) => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-black">
      {props.isForgotPassword ? (
        <ForgotPasswordOtpVerificationForm isInstructor={props.isInstructor} />
      ) : (
        <OtpVerification isInstructor={props.isInstructor} />
       )}
    </div>
  );
};

export default VerifyOtp;