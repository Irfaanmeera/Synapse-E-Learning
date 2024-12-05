import EnterMailForgotPasswordForm from "../../components/auth/EnterEmailPassword";

function InstructorEnterMailForgotPassword() {
  return (
    <div className="w-full h-screen flex justify-center items-center text-black">
      <EnterMailForgotPasswordForm isInstructor={true} />;
    </div>
  );
}

export default InstructorEnterMailForgotPassword;