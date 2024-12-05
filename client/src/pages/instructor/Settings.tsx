import Breadcrumb from "../../components/instructor/Breadcrumbs/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/userSlice";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { updateInstructor } from "../../api/instructorApi";
import { toast } from "react-hot-toast";

const validateName = (name: string) => {
  if (!name.trim()) return "Name should not be empty";
  if (!/^[A-Za-z ]+$/.test(name))
    return "Name should only contain alphabets and spaces";
  if (name.length < 2) return "Name must be at least 2 characters long";
  if (name.length > 50) return "Name must be less than 50 characters";
  return "";
};

const validateMobile = (mobile: string) => {
  if (!/^\d+$/.test(mobile)) return "Mobile number should contain only numbers";
  if (mobile.length !== 12)
    return "Mobile number must be exactly 12 digits including the country code";
  return "";
};

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user.user);

  console.log("Instructor Check: ", user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    qualification: user?.qualification || "",
    description: user?.description || "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    qualification?: string;
    description?: string;
  }>({});
  const [edit, update] = useState({
    required: true,
    disabled: true,
    isEdit: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "name") {
      const nameError = validateName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: nameError || undefined,
      }));
    }

    if (name === "mobile") {
      const mobileError = validateMobile(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: mobileError || undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);

    if (nameError || mobileError) {
      setErrors({ name: nameError, mobile: mobileError });
      return;
    }

    try {
      const response = await updateInstructor(formData);
      if (response) {
        dispatch(userActions.saveUser({ ...response, role: "instructor" }));
        toast.success("Details updated successfully");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update the user.");
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Full Name */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="name"
                      id="fullName"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="mobile"
                    >
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="mobile"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="qualification"
                  >
                    Qualification
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="qualification"
                    id="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="mt-5.5">
                  <button
                    type="button"
                    className="rounded bg-primary py-2 px-6 text-white"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
