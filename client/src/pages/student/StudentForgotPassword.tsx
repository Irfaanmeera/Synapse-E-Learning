import ForgotPasswordForm from "../../components/auth/forgotPassword";

export default function StudentForgotPassword() {
  return (
    <div className="w-full h-screen flex justify-center items-center text-black">
      <ForgotPasswordForm isInstructor={false} />
    </div>
  );
}