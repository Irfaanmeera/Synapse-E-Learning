import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { studentLogin, resendOtp } from "../../api/authentication";
import { userActions } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OAuth from "../auth/OAuth";
import { socket } from "../socket/socket";

interface StudentData {
  email: string;
  password: string;
}

interface SigninProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Signin: FC<SigninProps> = ({ isOpen, closeModal }) => {
  const [err, setErr] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentData>({
    resolver: zodResolver(loginSchema),
  });

  const submitData = async (data: StudentData) => {
    try {
      dispatch(userActions.setEmail(data.email));
      const response = await studentLogin(data);
      console.log("Login response:", response);
      dispatch(userActions.saveUser(response));
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        socket.connect();
        navigate("/");
      });

      socket.connect();
    } catch (error: any) {
      console.error("Caught error:", error);

      setErr(error);
    }
  };
  return (
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
          <div className="flex min-h-full items-center justify-center p-2 text-center">
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
                <div className="flex min-h-full items-center justify-center py-2 px-4 sm:px-6 lg:px-8">
                  <div className="w-full max-w-md space-y-8">
                    <div>
                      <h2 className="mt-4 text-center text-xl font-semibold tracking-tight text-slategray">
                        Sign in
                      </h2>
                    </div>
                    <div>
                      {err && <p className="text-red text-sm">{err}</p>}
                    </div>
                    <form
                      onSubmit={handleSubmit(submitData)}
                      className="mt-6 space-y-6"
                    >
                      <input
                        type="hidden"
                        name="remember"
                        defaultValue="true"
                      />
                      <div className="-space-y-px rounded-md shadow-sm">
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
                          <label htmlFor="password" className="sr-only">
                            Password
                          </label>
                          <input
                            id="password"
                            {...register("password")}
                            type="password"
                            required
                            className="relative block w-full appearance-none rounded-none rounded-b-md border border-grey500 px-3 py-2 text-slategray placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password"
                          />
                          {errors.password && (
                            <span className="text-red text-sm italic">
                              *{errors.password.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <div className="text-sm">
                          <Link to={"/forgot-password"}>
                            <p className="text-center text-sm text-gunmetalgray font-serif cursor-pointer">
                              Forgot password ?
                            </p>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="group relative font-serif  flex w-full justify-center rounded-md border border-transparent bg-Blueviolet py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon
                              className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                              aria-hidden="true"
                            />
                          </span>
                          Sign In
                        </button>
                      </div>
                    </form>
                    <div className="flex justify-center items-center">
                      <span className="w-full border border-gray-blue"></span>
                      <span className="px-4 text-sm text-slategray font-serif ">
                        Or
                      </span>
                      <span className="w-full border border-gray-blue"></span>
                    </div>
                    <OAuth
                      setError={function (error: string): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Signin;
