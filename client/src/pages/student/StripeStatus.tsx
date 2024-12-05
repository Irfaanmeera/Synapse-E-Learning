/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enrollment } from "../../api/studentApi";
import { userActions } from "../../redux/userSlice";
const StripeStatus = () => {
  let firstCall = true;
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(search);
  const success = params.get("success");
  const courseId = params.get("courseId");

  const payment = async () => {
    try {
      if (courseId && firstCall) {
        firstCall = false;
        const response = await enrollment(courseId!);
        dispatch(userActions.addCourse(courseId));
        if (response) {
          navigate("/myLearning", {
            state: { courseId },
          });
        }
      }
    } catch (error) {
      navigate("/myLearning", {
        state: { courseId },
      });
    }
  };

  useEffect(() => {
    setTimeout(() => payment(), 2000);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center text-black">
      <div className="md:w-3/5 w-4/5 min-h-[30vh] flex flex-col gap-4 justify-center items-center shadow-2xl rounded-md bg-slate-300">
        <h1
          className={
            success === "true"
              ? "font-bold text-2xl text-green-700"
              : "font-bold text-2xl text-red-700"
          }
        >
          {success === "true" ? "Payment Success" : "Payment failed"}
        </h1>
        {success === "true" && (
          <div className="flex items-center gap-2">
            {/* <SmallSpinner /> */}
            <p>Verifying payment. Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeStatus;