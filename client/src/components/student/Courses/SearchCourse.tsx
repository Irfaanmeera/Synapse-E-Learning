import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { Course } from "../../../interfaces/course";
import CourseCard from "./CourseCard";
import { userActions } from "../../../redux/userSlice"; // Update with your slice path
import { searchCourse } from "../../../api/studentApi";
import { Pagination } from "@mui/material";

const ITEMS_PER_PAGE = 6; // Number of courses per page

const SearchCourse: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchResults = useSelector((state: RootState) => state.user.searchResults);
  
  const { searchTerm } = location.state || { searchTerm: "" };

  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Step 1: Fetch courses only once when there is a searchTerm and no searchResults in Redux.
  useEffect(() => {
    // Avoid fetching if searchResults is already available
    if (searchResults.length > 0) {
      setCourses(searchResults);
    } else if (searchTerm && searchResults.length === 0) {
      const fetchResults = async () => {
        const response = await searchCourse(searchTerm);
        if (response) {
          dispatch(userActions.setSearchResults(response)); // Store results in Redux
          setCourses(response); // Update the local state with the fetched results
        }
      };
      fetchResults();
    } else if (!searchTerm) {
      navigate("/"); // Navigate away if no search term
    }
  }, [searchTerm, searchResults, dispatch, navigate]);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  // Step 2: Paginate courses based on current page
  const displayedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="text-lg text-lightgray font-semibold mb-4 mt-10 ml-10">
        {searchTerm ? `Search Results for: "${searchTerm}"` : "Search Results"}
      </h1>
      {displayedCourses.length > 0 ? (
        <>
          <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <p className="text-slategray text-lg mb-4">No courses found. Try searching for something else.</p>
          <img
            src="https://www.sharpmultinational.com/public/front/img/no-course.jpg"
            alt="No courses available"
            className="max-w-sm"
          />
        </div>
      )}
    </div>
  );
};

export default SearchCourse;



// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { RootState } from "../../../redux/store";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Course } from "../../../interfaces/course";
// import CourseCard from "./CourseCard";
// import { userActions } from "../../../redux/userSlice"; // Update with your slice path
// import { searchCourse } from "../../../api/studentApi";
// import { Pagination } from "@mui/material";

// const ITEMS_PER_PAGE = 6; // Number of courses per page

// const SearchCourse: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchResults = useSelector((state: RootState) => state.user.searchResults);
  
//   const { searchTerm } = location.state || { searchTerm: "" };

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     // If search results are available in the Redux state, use them
//     if (searchResults.length > 0) {
//       setCourses(searchResults);
//     } else if (!searchTerm) {
//       // Redirect to home page if no searchTerm is provided and no results exist
//       navigate("/");
//     }
//   }, [searchResults, searchTerm, navigate]);

//   useEffect(() => {
//     // Only fetch new data if searchTerm is set and there are no searchResults
//     if (!searchResults.length && searchTerm) {
//       const fetchResults = async () => {
//         const response = await searchCourse(searchTerm);
//         if (response) {
//           dispatch(userActions.setSearchResults(response)); // Set the search results in Redux
//           setCourses(response); // Update local state with the fetched results
//         }
//       };
//       fetchResults();
//     }
//   }, [searchTerm, searchResults, dispatch]); // Only trigger if searchTerm or searchResults changes

//   const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

//   // Paginate courses based on current page
//   const displayedCourses = courses.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <h1 className="text-lg text-lightgray font-semibold mb-4 mt-10 ml-10">
//         {searchTerm ? `Search Results for: "${searchTerm}"` : "Search Results"}
//       </h1>
//       {displayedCourses.length > 0 ? (
//         <>
//           <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//             {displayedCourses.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>
//           <div className="flex justify-center mt-6">
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               size="medium"
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-[70vh] text-center">
//           <p className="text-slategray text-lg mb-4">No courses found. Try searching for something else.</p>
//           <img
//             src="https://www.sharpmultinational.com/public/front/img/no-course.jpg"
//             alt="No courses available"
//             className="max-w-sm"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchCourse;




// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { RootState } from "../../../redux/store";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Course } from "../../../interfaces/course";
// import CourseCard from "./CourseCard";
// import { userActions } from "../../../redux/userSlice"; // Update with your slice path
// import { searchCourse } from "../../../api/studentApi";
// import { Pagination } from "@mui/material";

// const ITEMS_PER_PAGE = 6; // Number of courses per page

// const SearchCourse: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchResults = useSelector((state: RootState) => state.user.searchResults);
  
//   const { searchTerm } = location.state || { searchTerm: "" };

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     if (searchResults.length > 0) {
//       setCourses(searchResults);
//     } else if (!searchResults.length && !searchTerm) {
//       navigate("/");
//     }
//   }, [searchResults, searchTerm, navigate]);

//   useEffect(() => {
//     if (!searchResults.length && searchTerm) {
//       const fetchResults = async () => {
//         const response = await searchCourse(searchTerm);
//         if (response) {
//           dispatch(userActions.setSearchResults(response));
//           setCourses(response);
//         }
//       };
//       fetchResults();
//     }
//   }, [searchTerm, searchResults]);

//   const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

//   // Paginate courses based on current page
//   const displayedCourses = courses.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div>
//       <h1 className="text-lg text-lightgray font-semibold mb-4 mt-10 ml-10">
//         {searchTerm ? `Search Results for: "${searchTerm}"` : "Search Results"}
//       </h1>
//       {displayedCourses.length > 0 ? (
//         <>
//           <div className="ml-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-10">
//             {displayedCourses.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>
//           <div className="flex justify-center mt-6">
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               size="medium"
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-[70vh] text-center">
//         <p className="text-slategray text-lg mb-4">No courses found. Try searching for something else.</p>
//         <img
//           src="https://www.sharpmultinational.com/public/front/img/no-course.jpg"
//           alt="No courses available"
//           className="max-w-sm"
//         />
//       </div>
//       )}
//     </div>
//   );
// };

// export default SearchCourse;



