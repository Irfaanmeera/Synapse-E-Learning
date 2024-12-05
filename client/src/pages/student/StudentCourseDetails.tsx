import React from "react";
import Navbarin from "../../components/student/Common/Navbar";
import Footer from "../../components/student/Common/Footer/Footer";
import CourseDetails from "../../components/student/Courses/SingleCourseDetails";

const StudentCourseDetails: React.FC = () => {
  return (
    <>
      <Navbarin />
      <CourseDetails />
      <Footer />
    </>
  );
};

export default StudentCourseDetails;
