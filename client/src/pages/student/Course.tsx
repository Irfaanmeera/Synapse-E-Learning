import React from 'react'
import Navbarin from '../../components/student/Common/Navbar'
import Footer from '../../components/student/Common/Footer/Footer'
import UserCourses from '../../components/student/Courses/UserCourses'



const Course: React.FC= () => {

  return (
    <>
      <Navbarin/>
      {/* <ResponsiveAppBar/> */}
     
      <UserCourses/>
      <Footer/>
    </>
  )
}

export default Course;
