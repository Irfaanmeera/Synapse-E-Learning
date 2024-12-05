/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  course: any;
};

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Link to={`/courseDetails/${course?.id}`}>
      <div className="w-80 h-full backdrop-blur border border-2 border-opacity-20 border-Blueviolet rounded-lg p-3 transition-transform transform hover:scale-105 duration-300 shadow-sm hover:shadow-lg">
        <div className="relative h-[30vh] overflow-hidden rounded-t-lg">
          <img
            src={course.image}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg "
            alt="Course Thumbnail"
          />
        </div>
        <div className="p-3 flex flex-col justify-between h-[calc(15vh - 3rem)]">
          <div className="h-[50px] overflow-hidden overflow-ellipsis mb-2">
            <h1 className="font-Poppins text-midnightblue font-sem text-[17px] mt-5">
              {course.name.slice(0, 70)}
            </h1>
          </div>
          <div className="flex items-center justify-between -mt-2 text-gray-600">
            <h5 className="flex items-center text-gray-700">{course.level}</h5>
          </div>
          <div className="flex items-center justify-between mt-2 text-gray-600">
            <h5 className="flex items-center text-gray-700">
              {course.price === 0 ? "Free" : "₹" + course.price}
            </h5>
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
              {course.modules?.length} chapters
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
    </Link>
  );
};

export default CourseCard;
