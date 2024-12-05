import React from "react";
import Navbarin from "../../components/student/Common/Navbar";
import Footer from "../../components/student/Common/Footer/Footer";
import SearchCourse from "../../components/student/Courses/SearchCourse";

const SearchCourses: React.FC = () => {
  return (
    <>
      <Navbarin />
      <SearchCourse />
      <Footer />
    </>
  );
};

export default SearchCourses;
