import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { instructorSignup } from "../../api/authentication";
import { userActions } from "../../redux/userSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../validations/signupSchema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface InstructorData {
  name: string;
  email: string;
  mobile: number;
  password: string;
}

const InstructorSignupForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [err, setErr] = useState("");

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<InstructorData>({
    resolver: zodResolver(signupSchema),
  });

  const submitData = async (data: InstructorData) => {
    try {
      console.log("response sent");
      const response = await instructorSignup(data);
      if (response?.success) {
        dispatch(userActions.setEmail(data.email));
        navigate("/instructor/verifyOtp");
      }
    } catch (error) {
      console.log("Error:", error);
      if (typeof error === "string") {
        setErr(error);
      } else {
        setErr("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
        <div className="hidden lg:block">
          <button
            className="text-Blueviolet text-sm ml-1 px-1 transition duration-150 ease-in-out rounded-full bg-transparent hover:text-white hover:bg-Blueviolet"
            onClick={openModal}
          >
            Register here
          </button>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex min-h-full items-center justify-center py-13 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-800">
                          Instructor Sign Up
                        </h2>
                      </div>
                      <form
                        onSubmit={handleSubmit(submitData)}
                        className="mt-8 space-y-6"
                      >
                        <div className="-space-y-px rounded-md shadow-sm">
                          <div>
                            <label htmlFor="user_name" className="sr-only">
                              User Name
                            </label>
                            <input
                              id="user_name"
                              type="text"
                              {...register("name")}
                              required
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="User Name"
                            />
                            {errors.name && (
                              <span className="text-red-600 text-sm italic">
                                *{errors.name.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <label htmlFor="email-address" className="sr-only">
                              Email Id
                            </label>
                            <input
                              id="email-address"
                              {...register("email")}
                              type="email"
                              required
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="Email Id"
                            />
                            {errors.email && (
                              <span className="text-red text-sm italic">
                                *{errors.email.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <label htmlFor="mobile" className="sr-only">
                              Phone No
                            </label>

                            <PhoneInput
                              country={"in"}
                              inputProps={{
                                name: "mobile",
                                id: "mobile",
                                required: true,
                                className:
                                  "relative block w-full appearance-none rounded-none rounded-b-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm",
                              }}
                              onChange={(value: string) =>
                                setValue("mobile", value, {
                                  shouldValidate: true,
                                })
                              }
                            />

                            {errors.mobile && (
                              <span className="text-red text-sm italic">
                                *{errors.mobile.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <label htmlFor="password" className="sr-only">
                              Password
                            </label>
                            <input
                              id="password"
                              {...register("password")}
                              type="password"
                              required
                              className="relative block w-full appearance-none rounded-none rounded-b-md border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="Password"
                            />
                            {errors.password && (
                              <span className="text-red text-sm italic">
                                *{errors.password.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon
                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                aria-hidden="true"
                              />
                            </span>
                            Send OTP
                          </button>
                        </div>
                        {err && <p className="text-red text-sm">{err}</p>}
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InstructorSignupForm;
