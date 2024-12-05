import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import {
  getAllCategories,
  getAllCourses,
  getCourses,
} from "../../../api/studentApi";
import { Course } from "../../../interfaces/course";
import { Pagination, Chip, Typography, Button } from "@mui/material";
import { Category } from "../../../interfaces/Category";

const UserCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(""); // State for selected category ID
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);

  // Fetch all courses or category-specific courses
  const fetchCourses = async (page: number, categoryId?: string) => {
    try {
      console.log("Fetching courses - page:", page, "categoryId:", categoryId); // Debug log

      const response: { courses: Course[]; totalCount: number } = categoryId
        ? await getCourses(page, categoryId) // Pass categoryId if selected
        : await getAllCourses(page); // Otherwise fetch all courses

      const filteredCourses = response.courses.filter(
        (course) => course.approval === "Approved" && course.status === true
      );
      setCourses(filteredCourses);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses.");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    console.log("Category selected:", categoryId);
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    fetchCourses(1, categoryId);
  };

  // Show all courses when "All" is clicked
  const handleShowAll = () => {
    setSelectedCategoryId("");
    setCurrentPage(1);
    fetchCourses(1);
  };

  // Handle pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    fetchCourses(page, selectedCategoryId);
  };

  useEffect(() => {
    fetchCourses(1);
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="mx-10 my-2 w-80vw">
      {error && <div>{error}</div>}

      <div className="flex gap-2 overflow-x-auto py-4">
        <Chip
          label="All"
          onClick={handleShowAll}
          color={selectedCategoryId === "" ? "primary" : "default"}
          style={{
            cursor: "pointer",
            borderColor: selectedCategoryId === "" ? "#1976d2" : "#ccc",
            backgroundColor: selectedCategoryId === "" ? "#222C44" : "#ccc",
            fontWeight: selectedCategoryId === "" ? "bold" : "normal",
            fontSize: "1rem",
          }}
        />

        {/* Category Chips */}
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.category}
            clickable
            onClick={() => handleCategorySelect(cat.id)}
            color={selectedCategoryId === cat.id ? "primary" : "default"}
            style={{
              cursor: "pointer",
              borderColor: selectedCategoryId === cat.id ? "#1976d2" : "#ccc",
              backgroundColor:
                selectedCategoryId === cat.id ? "#222C44" : "#DBDCD4",
              fontWeight: selectedCategoryId === cat.id ? "bold" : "normal",
              fontSize: "1rem",
              transition: "all 0.1s ease",
            }}
          />
        ))}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-6">
          <Typography variant="h6" color="textSecondary">
            No courses available in this category.
          </Typography>
        </div>
      ) : (
        <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="large"
        />
      </div>
    </div>
  );
};

export default UserCourses;
