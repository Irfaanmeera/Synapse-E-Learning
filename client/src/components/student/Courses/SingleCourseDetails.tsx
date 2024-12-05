import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Divider } from "@mui/material";
import { CourseSidebar } from "./CourseSidebar";
import { LearningPoints } from "./LearningPoints";
import { getSingleCourse } from "../../../api/studentApi";
import { useParams } from "react-router-dom";
import { Course } from "../../../interfaces/course";
import CourseContent from "./CourseContent";
import { Module } from "../../../interfaces/module";

const CourseDetails: React.FC = () => {
  const [course, setCourse] = useState<Course>();
  const { courseId } = useParams();
  

  const getCourse = async () => {
    try {
      const response = await getSingleCourse(courseId);
      console.log("Course Details in get course api: ", response)
      if (response) {
        setCourse(response);
      
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourse();
    console.log("Course in useEffect: ", course)
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              position: "relative",
              backgroundImage: `url(${course?.image}), linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.7))`,
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              mb: 3,
              height: 300, // Adjust the height as needed
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "white",
        
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#ffff",paddingLeft:3 }}>
              {course?.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#ffff" ,paddingLeft:5}}>
              {course?.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "#ffff", paddingLeft:5 }}>
              Updated: 10/2024 • English • Rating: 4.7 (230,000+ ratings) • 940,000+ students
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* What you'll learn section */}
          <LearningPoints />

          <Divider sx={{ my: 3 }} />

          {/* Course content */}
          {/* <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This course includes:
              </Typography>
              <ul>
                <li>68.5 hours on-demand video</li>
                <li>8 coding exercises</li>
                <li>23 articles</li>
                <li>Access on mobile and TV</li>
                <li>Certificate of completion</li>
              </ul>
            </CardContent>
          </Card> */}
          <Card variant="outlined">
            <CardContent>
             <CourseContent course={course}/>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <CourseSidebar course={course} /> 
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails;