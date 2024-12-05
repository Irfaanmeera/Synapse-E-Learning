/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleCourse } from "../../../api/studentApi";
import CourseDetailsStudent from "../../../components/student/Courses/CourseDetailsStudent";
import Navbarin from "../../../components/student/Common/Navbar";
import Footer from "../../../components/student/Common/Footer/Footer";

const CourseDetailsPage: React.FC = () => {
  const [course, setCourse] = useState<any>();
  const [error, setError] = useState("");

  const params = useParams();

  const getCourse = async () => {
    const courseId = params._id || "";
    const res = await getSingleCourse(courseId);
    console.log("Course Details: ", res);
    return new Promise((resolve, reject) => {
      if (res?.data) {
        setCourse(res.data.result.course);
        resolve(res.data.result.course);
      } else {
        setError(res?.data.message);
        reject(res?.data.message);
      }
    });
  };

  useEffect(() => {
    getCourse();
  });

  return (
    <div>
      {/* {stripePromise && ( */}
      <Navbarin />
      <CourseDetailsStudent />
      <Footer />
      {/* )} */}
    </div>
  );
};

export default CourseDetailsPage;
