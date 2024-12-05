/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { getTotalChapterCountByCourseId } from "../../../api/studentApi";

type Props = {
  enrolledCourse: any;
};

const LearningCard: React.FC<Props> = ({ enrolledCourse }) => {
  const [progress, setProgress] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const courseId = enrolledCourse.courseId.id;

  const goToCourse = () => {
    navigate(`/singleEnrolledCourse/${courseId}`);
  };

  useEffect(() => {
    const fetchChapterCount = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getTotalChapterCountByCourseId(courseId);
        const totalChapters = result.totalChapters;

        setChapterCount(totalChapters);
        const calculatedProgress =
          Math.floor(
            (enrolledCourse.progression.length / totalChapters) * 100
          ) || 0;
        setProgress(calculatedProgress);
      } catch (err) {
        setError("Failed to load chapter count");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchChapterCount();
    }
  }, [courseId, enrolledCourse.progression.length]);

  return (
    <div className="w-90 h-full backdrop-blur border-2 border-opacity-20 border-Blueviolet rounded-lg p-3 transition-transform transform hover:scale-105 duration-300 shadow-sm hover:shadow-lg">
      <div className="relative h-[30vh] overflow-hidden rounded-t-lg">
        <img
          src={enrolledCourse.courseId.image}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          alt="Course Thumbnail"
          onClick={goToCourse}
        />
      </div>
      <div className="p-3 flex flex-col justify-between h-[calc(15vh - 3rem)]">
        <div className="h-[50px] overflow-hidden overflow-ellipsis mb-2">
          <h1 className="font-Poppins text-midnightblue font-sem text-[17px] mt-5">
            {enrolledCourse.courseId.name.slice(0, 70)}
          </h1>
        </div>
        <div className="flex items-center justify-between -mt-2 text-gray-600">
          <h5 className="flex items-center text-gray-700">
            {enrolledCourse.courseId.instructor.name}
          </h5>
        </div>
      </div>

      {loading ? (
        <p>Loading progress...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ProgressBar progress={progress} />
      )}

      <hr style={{ color: "#C4C4C4" }} />
      <div className="text-center">
        <button
          className="bg-Blueviolet text-white px-6 py-2 mt-5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 duration-200 transition"
          onClick={goToCourse}
        >
          Go to Course
        </button>
      </div>
    </div>
  );
};

export default LearningCard;
