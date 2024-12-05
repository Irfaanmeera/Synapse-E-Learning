import { useState, useEffect } from "react";
import { Course } from "../../../interfaces/course";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Breadcrumb from "../../instructor/Breadcrumbs/Breadcrumb";
import { getSingleCourse } from "../../../api/adminApi";


const SingleCourseViewAdmin = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await getSingleCourse(courseId!);
        console.log("Sinle course Admin Response: ", response);
        setCourse(response);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="p-4">
      <Breadcrumb pageName={`Courses / ${course?.name}`} />

      <Card className="max-w-5xl ml-4 shadow-md">
        <CardContent className="flex items-center justify-between">
          <div>
            <Typography variant="h6" className="font-bold">
              {course?.name || "Course Name Not Available"}
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mt-2">
              {course?.description || "Course description not available."}
            </Typography>
            <div className="mt-4 space-y-1">
              <Typography variant="subtitle1" color="textSecondary">
                Level: {course?.level || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: ${course?.price || "0"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Category: {course?.category?.category || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Approval:{" "}
                <span
                  style={{
                    color:
                      course?.approval === "Approved"
                        ? "green"
                        : course?.approval === "Pending"
                        ? "red"
                        : "inherit",
                  }}
                >
                  {course?.approval || "N/A"}
                </span>
              </Typography>
            </div>
          </div>

          <CardMedia
            component="img"
            image={course?.image || "default-course-image.jpg"}
            alt={course?.name || "Course Image"}
            className="-mt-17"
            sx={{
              height: 120,
              width: 200,
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </CardContent>

        <div className="flex justify-end -mt-14 mb-4 mr-4 space-x-2"></div>
      </Card>
    </div>
  );
};

export default SingleCourseViewAdmin;
