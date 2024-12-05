import React from 'react'
import Navbarin from '../../components/student/Common/Navbar'
import Banner from '../../components/student/Home/Banner'
import Courses from '../../components/student/Home/Courses'
import Companies from '../../components/student/Home/Companies/Companies'
import Mentor from '../../components/student/Home/Mentor'
import Testimonials from '../../components/student/Home/Testimonials/index'
import Footer from '../../components/student/Common/Footer/Footer'
import UserCourses from '../../components/student/Courses/UserCourses'


const StudentHome: React.FC= () => {

  return (
    <>
      <Navbarin/>
      <Banner/>
      <Companies/>
      <Courses/>
      <Mentor/>
      <Testimonials/>
      <Footer/>
    </>
  )
}

export default StudentHome;
