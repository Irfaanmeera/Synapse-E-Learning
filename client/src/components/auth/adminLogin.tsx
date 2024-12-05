import { FC, useState } from "react";
import { adminLogin } from "../../api/authentication";
import { userActions } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { Admin } from "../../interfaces/Admin";

const Signin: FC = () => {
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Admin>({
    resolver: zodResolver(loginSchema),
  });

  const submitData = async (data: Admin) => {
    try {
      dispatch(userActions.setEmail(data.email));
      const response = await adminLogin(data);
      console.log("Login response:", response);

      dispatch(userActions.saveUser(response));
      navigate("/admin");
    } catch (error: any) {
      setErr(error);
      console.log("Error set:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-8">
      <div className="text-3xl font-extrabold text-center bg-gradient-to-r from-Blueviolet to-charcoal bg-clip-text text-transparent">
Synapse
</div>
<h2 className="text-xl font-extrabold text-center bg-gradient-to-r from-Blueviolet to-bodydark2 bg-clip-text text-transparent">
Admin Login
</h2>

        <form onSubmit={handleSubmit(submitData)} className="mt-8 space-y-8">

          <div className="space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="block text-sm font-serif text-slategray">
                Email Address
              </label>
              <input
                id="email-address"
                {...register("email")}
                type="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-grey500 px-3 py-4 text-bodydark2 font-serif placeholder-body focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email Address"
              />
              {errors.email && (
                <span className="text-red text-sm italic">
                  *{errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-serif text-slategray">
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"} // Toggle input type
                required
                className="w-full mt-2 rounded-none rounded-t-md border border-grey500 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
              
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()} 
                onClick={() => setShowPassword(!showPassword)} 
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-charcoal" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-charcoal" />
                )}
              </span>
              {errors.password && (
                <p className="text-sm text-red-500 italic">
                  *{errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-Blueviolet to-meta-10 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

          {/* Error Message */}
          {err && <p className="text-red text-opacity-20 text-sm">{err}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signin;


