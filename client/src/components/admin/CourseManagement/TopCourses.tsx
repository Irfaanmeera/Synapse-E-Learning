import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { fetchCoursesByAdmin } from "../../../api/adminApi";
import { Course } from "../../../interfaces/course";

const TopCourses = () => {
  const [topCourses, setTopCourses] = useState<Course[]>([]);

  useEffect(() => {
    const getTopCourses = async () => {
      try {
        const data = await fetchCoursesByAdmin();
        const sortedCourses = data
          .sort((a: Course, b: Course) => b?.enrolled - a?.enrolled)
          .slice(0, 5);

        setTopCourses(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    getTopCourses();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black">Top 5 Courses</h4>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}
      >
        <Table>
          <TableHead className="bg-bodydark2">
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", color:"white" }}>
                S.No
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color:"white" }}>
                Course Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color:"white" }}>
                Enrolled
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topCourses.map((course, index) => (
              <TableRow
                key={course.id}
                sx={{
        
                  "&:hover": { bgcolor: "grey.200", cursor: "pointer" }, // Add hover effect
                }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{course.name}</TableCell>
                <TableCell align="center">{course.enrolled}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TopCourses;
