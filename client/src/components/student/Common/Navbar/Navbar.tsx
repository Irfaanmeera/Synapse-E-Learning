/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "../../../auth/StudentLogin";
import Registerdialog from "../../../auth/StudentSignup";
import InstructorSignIn from "../../../auth/instructorLogin";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../../../redux/userSlice";
import { RootState } from "../../../../redux/store";
import { Roles } from "../../../../interfaces/Roles";
import { toast } from "react-hot-toast";
import { Avatar, Typography } from "@mui/material";
import { searchCourse } from "../../../../api/studentApi";
import { Category } from "../../../../interfaces/Category";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((store: RootState) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [isOpenDrop2, setIsOpenDrop2] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const handleLogout = () => {
    dispatch(userActions.userLogout());
    if (user?.role === Roles.student) {
      navigate("/");
      toast.success("Logged Out Successfully");
    } else {
      navigate("/");
    }
  };

  const handleSearch = async () => {
    const searchTerm = searchInputRef.current?.value;
    console.log("Search Term", searchTerm);

    if (searchTerm) {
      const response = await searchCourse(searchTerm);
      if (response) {
        // Dispatch action to store search results
        dispatch(userActions.setSearchResults(response));

        // Navigate to the search results page with search term in state
        navigate("/searchCourses", { state: { searchTerm } });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDrop(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setIsOpenDrop2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Disclosure as="nav" className="navbar">
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 shadow-4 ">
          <div className="relative flex h-16 items-center justify-between my-1">
            {/* LOGO */}
            <div className="flex items-center">
  <div className="flex-shrink-0 px-3 text-ultramarine font-bold font-serif">
    <p className="text-xl lg:text-2xl">SYNAPSE</p>
  </div>
</div>


            {/* SEARCH BAR */}

            <div className="relative mx-4 flex items-center border border-lightgray rounded-3xl shadow-sm focus-within:ring-1 focus-within:ring-gray-blue">
              <input
                type="text"
                placeholder="Search Courses..."
                ref={searchInputRef}
                className="w-50 sm:w-30 md:w-60 lg:w-100 sm:pl-1 lg:pl-4 py-3 focus:outline-none border-none rounded-l-3xl"
              />
              <button
                type="submit"
                onClick={handleSearch}
                className="p-3 bg-Blueviolet hover:bg-midnightblue duration-150 ease-in-out rounded-full flex items-center justify-center mr-1"
              >
                <img
                  src="/assets/banner/search.svg"
                  alt="input-icon"
                  width={15}
                  height={15}
                />
              </button>
            </div>

            {/* Links */}
            <div className="hidden lg:block m-auto">
              <div className="flex space-x-4 ">
                {user?.role === Roles.student && (
                  <ul className="mt-2 mb-4 px-4 font-semibold flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                    <Link to={"/"}>
                      <Typography
                        as="li"
                        variant="inherit"
                        color="gray"
                        className="p-1 font-semibold"
                      >
                        <div className="flex items-center text-slategray font-serif">
                          Home
                        </div>
                      </Typography>
                    </Link>

                    <Link to={"/courses"}>
                      <Typography
                        as="li"
                        variant="inherit"
                        color="gray"
                        className="p-1 font-semibold"
                      >
                        <div className="flex items-center text-slategray font-serif">
                          Courses
                        </div>
                      </Typography>
                    </Link>
                  </ul>
                )}
              </div>
            </div>

            {/* USER SECTION */}
            {user ? (
              <div className="relative hidden lg:flex items-center space-x-3">
                {/* User name */}
                <Typography
                  as="div"
                  variant="inherit"
                  color="blue-gray"
                  className="p-1 font-semibold cursor-pointer"
                >
                  <div className="flex items-center text-slategray font-serif">
                    {user?.name}
                  </div>
                </Typography>
                <Avatar
                  alt={user?.name}
                  src={user?.image || ""}
                  className="w-8 h-8"
                >
                  {user?.name?.charAt(0)}
                </Avatar>

                {/* Dropdown Menu */}
                <div ref={dropdownRef2} className="relative z-50">
                  {/* Button to toggle dropdown */}
                  <button
                    className="flex items-center text-blue justify-center text-sm focus:outline-none bg-transparent rounded-xl border-Blueviolet"
                    onClick={() => setIsOpenDrop2(!isOpenDrop2)}
                  >
                    <ChevronDownIcon className="w-4 h-4 text-blue-500 ml-1" />
                  </button>

                  {/* Dropdown content */}
                  {isOpenDrop2 && (
                    <div className="absolute right-0 mt-2 w-54 bg-white border border-bodydark2 border-opacity-50 rounded-md shadow-lg">
                      <ul className="py-1 text-base text-slategray">
                        <Link to="/profile">
                          <li className="block px-4 py-2 hover:bg-gray hover:text-primary transition duration-150">
                            My Profile
                          </li>
                        </Link>
                        <Link to="/myLearning">
                          <li className="block px-4 py-2 hover:bg-gray hover:text-blue transition duration-150">
                            My Learnings
                          </li>
                        </Link>

                        <li
                          className="block px-4 py-2 hover:bg-gray hover:text-blue cursor-pointer transition duration-150"
                          onClick={handleLogout}
                        >
                          Log Out
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="ml-10 flex hidden lg:block items-center justify-between">
                <div className="flex space-x-0">
                  {" "}
                  <Link to={"/"}>
                    <Typography
                      variant="body2"
                      color="gray"
                      className="font-semibold"
                    >
                      <div className="flex text-base mt-2 mr-4 items-center text-slategray">
                        Home
                      </div>
                    </Typography>
                  </Link>
                  <Link to={"/courses"}>
                    <Typography
                      variant="body2"
                      color="gray"
                      className="font-semibold"
                    >
                      <div className="flex text-base mt-2 mr-4 items-center text-slategray">
                        Courses
                      </div>
                    </Typography>
                  </Link>
                  <Signdialog />
                  <InstructorSignIn />
                  <Registerdialog />
                </div>
              </div>
            )}

            {/* DRAWER FOR MOBILE VIEW */}
            <div className="block lg:hidden">
              <Bars3Icon
                className="block h-6 w-6"
                aria-hidden="true"
                onClick={() => setIsOpen(true)}
              />
            </div>

            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <Drawerdata />
            </Drawer>
          </div>
        </div>
      </>
    </Disclosure>
  );
};

export default Navbar;
