import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Course } from "../../../interfaces/course";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getSingleCourse} from "../../../api/studentApi";

const CourseView = () => {
  const user = useSelector((store: RootState) => store.user.user);
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course>();
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const {courseId} = useParams()

  console.log("courseId:", courseId)

//   const handleEnroll = async () => {
//     if (!user) {
//       navigate("/login");
//     } else {
//       try {
//         const response = await courseEnroll(course!.id!);
//         if (response) {
//           window.location.href = response;
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };
  const getCourse = async () => {
    try {
      const response = await getSingleCourse(courseId);
      console.log(response)
      if (response) {
        setCourse(response);
        if (user?.courses?.includes(response.id)) {
          setEnrolled(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToCourse = () => {
    navigate("/learning", { state: { courseId: course?.id } });
  };
  useEffect(() => {
    getCourse();
  }, []);
  return (
    <div className="w-full flex justify-center flex-col text-black">
      {/* <div className=" "> */}
      <div className="w-full flex justify-center bg-[#edf7fc] fade-ef">
        <div className="pt-16 md:w-4/5 -ml-44 flex justify-center ">
        <div className=" container pb-6 grid grid-cols-6 md:grid-cols-2">
            <div className="px-8 md:max-w-[800px]  flex justify-center items-center">
              {course?.image ? (
                <img className="h-50 w-700" src={course.image} alt="" />
              ) : (
                <div className="bg-cover w-full justify-center items-center flex  h-[200px]">
                  <h1 className="font-semibold">No images found</h1>
                </div>
              )}
            </div>
            <div className="col-span-1">
              <h1 className=" text-2xl">{course?.name}</h1>
              <h5 className="text-sm font-sans italic text-[#2F327D] pt-2">
                <i className="fa-solid fa-rectangle-list text-base "></i>
                {typeof course?.category === "object"
                  ? course.category.category
                  : course?.category}
              </h5>
              <h5 className="text-sm italic font-sans text-[#2F327D] pt-2">
                <i className="fa-solid fa-rectangle-list text-base "></i>
            
              </h5>

              <h2 className="py-2 ">
                {"Instructor: "}
                {typeof course?.instructor === "object"
                  ? `${course.instructor.name}`
                  : course?.instructor}
              </h2>
              {!enrolled && (
                <h2 className=" py-2">
                  {"₹ "}
                  {course?.price}
                </h2>
              )}
              {enrolled ? (
                <button
                  onClick={goToCourse}
                  className="px-6 py-2 shadow-sm rounded-sm bg-[#2F327D] text-white font-bold"
                >
                  Continue to Course
                </button>
              ) : (
                <button
                  className="mt-4 px-6 py-2 shadow-sm rounded-sm bg-[#5d8aed] text-white "
                //   onClick={handleEnroll}
                >
                  Enroll now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center fade-ef">
        <div className="pt-1 md:w-4/5 p-4 flex justify-center  ">
          <div className="p-6  container">
            <div className="w-full flex justify-between px-3">
              <h1 className=" text-lg font-serif text-ultramarine">Modules</h1>
            </div>
            {course?.modules && course?.modules?.length > 0 ? (
              <div className="py-4 -mb-7">
                {course.modules.map((module, index) => (
                  <div key={index} className="w-full">
                    <div className="icon flex justify-between px-3 ">
                      <div>
                        <i className="fa-regular fa-circle-play px-2"></i>
                        <span className="px-2 cursor-pointer">
                          {typeof module?.module === "object"
                            ? module.module.name
                            : module?.module}
                        </span>
                      </div>
                      <div className="">
                        <h4 className="text-right">
                          {typeof module?.module === "object"
                            ? module.module.duration
                            : module?.module}
                        </h4>
                      </div>
                    </div>
                    <hr className="mb-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-5 ">
                <h1 className="text-lg text-center">
                  No modules found
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center fade-ef">
        <div className=" md:w-4/5 pt-1 p-4 flex justify-center ">
          <div className="p-6  container ">
            <div className="w-full px-3">
              <h1 className=" text-lg text-ultramarine font-serif">Description</h1>
            </div>
            <div className="text-md px-3">
              <p>{course?.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center fade-ef">
        <div className="pt-1 md:w-4/5 p-4 flex justify-center  pb-16">
          <div className="p-6  container">
            <div className="w-full px-3 pb-4">
              <h1 className=" text-lg text-ultramarine font-serif">About Instructor</h1>
            </div>
            <div className="text-md px-3 pb-2">
              <h3 >
                {"Name: "}
                {typeof course?.instructor === "object"
                  ? `${course.instructor.name}`
                  : course?.instructor}
              </h3>
            </div>
            <div className="text-md px-3 pb-2">
              <h3 >
                {"Email: "}
                {typeof course?.instructor === "object"
                  ? `${course.instructor.email}`
                  : course?.instructor}
              </h3>
            </div>
            
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default CourseView;