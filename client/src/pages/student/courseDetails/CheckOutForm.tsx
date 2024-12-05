import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SaveUser } from "../../../../redux/features/loginSlice";
import { handleCreateOrder } from "../../../services/api/userApi";

type Props = {
  setOpen: any;
  course: any;
  socket:any;
};

const CheckoutForm: React.FC<Props> = ({ setOpen, course, socket}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [orderData, setOrderData] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);

      const payment_info = paymentIntent;
      const courseId = course._id;

      const res = await handleCreateOrder(courseId, payment_info);
          if (res?.data.success) {
            console.log(res.data);

            setOrderData(res.data.result.newOrder);
            dispatch(SaveUser(res.data.result.user));

            socket.emit("notification",{
              title:'New Order',
              message:`New order from ${course.courseTitle}`,
              userId:res.data.result.user._id,
              createdAt:Date.now()
            })

          }
    }
  };
  useEffect(() => {
    if (orderData) {
      setOpen(false);
      navigate(`/course-access/${course._id}`);
    }
  }, [orderData]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <div className="flex justify-between mt-4">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  mt-8 rounded-full focus:outline-none focus:shadow-outline"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner">
                Paying
              </div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-8 rounded-full focus:outline-none focus:shadow-outline "
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;