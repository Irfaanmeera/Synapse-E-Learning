import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getAllCourses } from "../../../../api/studentApi";
import { Course } from "../../../../interfaces/course";

// CAROUSEL SETTINGS
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  arrows: false,
  autoplay: false,
  speed: 500,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
  ],
};

const Courses = () => {
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchCourses = async (page: number) => {
    try {
      console.log("Fetching courses - page:", page);
      const response = await getAllCourses(page);
      const filteredCourses = response.courses.filter(
        (course) => course.approval === "Approved" && course.status === true
      );

      const sortedCourses = filteredCourses
        .sort((a, b) => b.enrolled - a.enrolled)
        .slice(0, 8);
      setTopCourses(sortedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    fetchCourses(1);
  }, []);

  return (
    <div id="courses">
      <div className="mx-auto max-w-7xl sm:py-8 px-4 lg:px-8">
        <div className="sm:flex justify-between items-center">
          <h6 className="text-midnightblue text-2xl lg:text-2xl font-semibold mb-2 sm:mb-0">
            Popular courses.
          </h6>
          <a
            href="/courses"
            className="text-Blueviolet text-lg font-medium space-links"
          >
            Explore courses&nbsp;&gt;&nbsp;
          </a>
        </div>

        <Slider {...settings}>
          {topCourses.map((course, i) => (
            <div key={i}>
              <div className="bg-white m-1 px-3 pt-1 pb-12 my-20 shadow-courses rounded-2xl h-[480px]">
                {" "}
                {/* Fixed height here */}
                <div className="relative rounded-3xl">
                  <Link to={`/courseDetails/${course?.id}`}>
                    <img
                      src={course.image}
                      alt="course"
                      width={389}
                      height={262}
                      className="m-auto clipPath"
                    />
                  </Link>
                  <div className="absolute right-5 -bottom-2 bg-ultramarine rounded-full p-6">
                    <h3 className="text-white uppercase text-center text-sm font-medium">
                      best <br /> seller
                    </h3>
                  </div>
                </div>
                <div className="px-3">
                  <h6 className="text-xl font-semibold  pt-6 text-black">
                    {course.name}
                  </h6>
                  <p className="text-xl pt-1 text-black">{course?.level}</p>

                  <div className="flex justify-between items-center py-4">
                    <div className="flex gap-4">
                      <h3 className="text-red text-22xl font-medium">
                        {course?.rating}
                      </h3>
                    </div>
                    <div>
                      <h4 className="text-2xl font-medium">₹ {course.price}</h4>
                    </div>
                  </div>

                  <hr style={{ color: "#C4C4C4" }} />

                  <div className="flex justify-between pt-6">
                    <div className="flex gap-4">
                      <img
                        src="/assets/courses/book-open.svg"
                        alt="classes"
                        width={24}
                        height={24}
                        className="inline-block m-auto"
                      />
                      <h3 className="text-base font-medium text-black opacity-75">
                        {course.modules?.length} classes
                      </h3>
                    </div>
                    <div className="flex gap-4">
                      <img
                        src="/assets/courses/users.svg"
                        alt="students"
                        width={24}
                        height={24}
                        className="inline-block m-auto"
                      />
                      <h3 className="text-base font-medium text-black opacity-75">
                        {course.enrolled} students
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Courses;
