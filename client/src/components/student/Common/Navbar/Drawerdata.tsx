import React, { useState } from "react";
import Signin from "../../../auth/StudentLoginModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import StudentSignupForm from "../../../auth/StudentSignupModal";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/", current: true },
  { name: "Courses", href: "/courses", current: false },
  { name: "Profile", href: "/profile", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Data = () => {
  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const user = useSelector((store: RootState) => store.user.user);
  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-1 px-5 pt-2 pb-3 ml-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "text-black hover:opacity-100"
                    : "hover:text-black hover:opacity-100",
                  "py-1 ml-1 text-lg font-normal opacity-75 block"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
            {!user ? (
              <div className="flex flex-col items-start p-1 mt-2">
                <button
                  className="mb-4 w-50 bg-cornflowerblue hover:bg-primary text-white px-2 py-2 rounded"
                  onClick={() => setSigninOpen(true)}
                >
                  Log In
                </button>
                <button
                  className=" w-50 bg-cornflowerblue  hover:bg-primary text-white px-2 py-2 rounded"
                  onClick={() => setSignupOpen(true)}
                >
                  Sign Up
                </button>

                <Signin
                  isOpen={isSigninOpen}
                  closeModal={() => setSigninOpen(false)}
                />
                <StudentSignupForm
                  isOpen={isSignupOpen}
                  closeModal={() => setSignupOpen(false)}
                />
              </div>
            ) : (
              <div>Welcome, {user.name}!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
