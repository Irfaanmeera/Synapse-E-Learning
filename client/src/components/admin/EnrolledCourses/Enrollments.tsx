import { useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { EnrolledCourse } from "../../../interfaces/enrolledCourse";
import { fetchEnrolledCourses } from "../../../api/adminApi";

const Enrollments = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const fetchCourses = async () => {
    try {
      const response = await fetchEnrolledCourses();
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.studentId?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      course.courseId?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortCriteria === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortCriteria === "course") {
      return (a.courseId?.name || "").localeCompare(b.courseId?.name || "");
    } else if (sortCriteria === "instructor") {
      return (a.courseId?.instructor?.name || "").localeCompare(
        b.courseId?.instructor?.name || ""
      );
    }
    return 0;
  });

  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(date));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Enrolled Students
      </h4>

      <div className="mb-4 flex gap-4 items-center">
        <TextField
          label="Search by Student or Course Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <MenuItem value="date">Date of Joining</MenuItem>
            <MenuItem value="course">Course Name</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden", mb: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow className="bg-bodydark2">
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                S.No
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Student
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Course
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Date of Joining
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Revenue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentCourses.map((course, index) => (
              <TableRow
                key={course.id || index}
                sx={{
                  "&:hover": { bgcolor: "grey.200", cursor: "pointer" }, // Add hover effect
                }}
              >
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {indexOfFirstCourse + index + 1}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {typeof course.studentId === "object"
                    ? course.studentId?.name
                    : course.studentId || "N/A"}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {typeof course.courseId === "object"
                    ? course.courseId?.name
                    : course.courseId || "N/A"}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {course.date ? formatDate(course.date) : "N/A"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "success.main", fontWeight: "medium" }}
                >
                  ${Math.round((course.courseId?.price ?? 0) )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Enrollments;
