import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Course } from "../../../interfaces/course";
import { fetchInstructorCourses } from "../../../api/instructorApi";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";



const CourseDisplay = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8; // Number of courses per page

  // Replace with actual instructor ID

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetchInstructorCourses(page); // Ensure page is passed correctly
        console.log("InstructorCourses: ", response); // Log the full response
        setCourses(response.courses); // Correctly set the courses
        setTotalCount(response.totalCount); // Correctly set the total count
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div style={{ padding: "20px" }}>
   
      <Breadcrumb pageName={`Courses`} />
     
      <Typography variant="h6" className="mb-9 pb-3" gutterBottom>
        My Courses
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4} >
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={course.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Link to={`/instructor/courseDetails/${course.id}`}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image || "default-course-image.jpg"}
                    alt={course.name}
                    sx={{ objectFit: 'cover' }} // Ensures the image covers the area without stretching
                  />
                </Link>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹ {course.price}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category: {course.category?.category}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Level: {course.level}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status: {course.approval}
                  </Typography>
                  <hr  className="mt-4" style={{ color: "#C4C4C4" }} />
                  <div className="flex justify-between pt-4">
                                            <div className="flex gap-3">
                                                <img src='/assets/courses/book-open.svg' alt="classes" width={24} height={24} className="inline-block m-auto" />
                                                <h3 className="text-base font-normal text-black opacity-75">{course.modules?.length} chapters</h3>
                                            </div>
                                            <div className="flex gap-3">
                                                <img src='/assets/courses/users.svg' alt="students" width={24} height={24} className="inline-block m-auto" />
                                                <h3 className="text-base font-medium text-black opacity-75">{course.enrolled} students</h3>
                                            </div>
                                        </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Pagination
        count={Math.ceil(totalCount / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default CourseDisplay;
