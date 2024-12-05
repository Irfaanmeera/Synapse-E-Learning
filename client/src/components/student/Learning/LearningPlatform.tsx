import { useEffect, useState } from "react";
import { Breadcrumbs } from "@mui/material";
import { Link} from "react-router-dom";
import LearningCard from "./LearningCard";
import { getAllEnrolledCourse } from "../../../api/studentApi";
import { EnrolledCourse } from "../../../interfaces/enrolledCourse";


const LearningPlatform = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  

  const fetchCourses = async () => {
    try {
      const enrolledCourses = await getAllEnrolledCourse();
      console.log(enrolledCourses);
      setEnrolledCourses(enrolledCourses);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mt-5 mb-6" style={{ padding: "16px" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="" color="inherit">
              Home
            </Link>
            <Link to="" color="primary">
              My Learnings
            </Link>
          </Breadcrumbs>
        </div>

        {loading && <div>Loading courses...</div>}

        {error && <div className="text-red-500">{error}</div>}

        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 mt-10">
          {enrolledCourses.map((enrolledCourse) => (
            <div key={enrolledCourse.id}>
              <LearningCard enrolledCourse={enrolledCourse} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform;
