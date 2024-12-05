import React from 'react'
import Navbarin from '../../components/student/Common/Navbar'
import Footer from '../../components/student/Common/Footer/Footer'
import LearningPlatform from '../../components/student/Learning/LearningPlatform'


const MyLearning: React.FC= () => {

  return (
    <>
      <Navbarin/>
      <LearningPlatform/>
      <Footer/>
    </>
  )
}

export default MyLearning;