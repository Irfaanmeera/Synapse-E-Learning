import React from "react";
import Navbarin from "../../components/student/Common/Navbar";
import Footer from "../../components/student/Common/Footer/Footer";
import SingleEnrolledCourse from "../../components/student/Learning/SingleEnrolledCourse";

const SingleEnrolledCoursePage: React.FC = () => {
  return (
    <>
      <Navbarin />
      <SingleEnrolledCourse />
      <Footer />
    </>
  );
};

export default SingleEnrolledCoursePage;
