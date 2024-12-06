import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import AuthProtected from "../components/Common/protectedRoutes/AuthProtectedRoles";
import { Roles } from "../interfaces/Roles";
import AdminLogin from "../components/auth/adminLogin";
import Profile from "../pages/student/Profile";
import Dashboard from "../pages/instructor/Dashboard";
import InstructorLayout from "../pages/instructor/InstructorLayout";
import InstructorProfile from "../pages/instructor/InstructorProfile";
import Settings from "../pages/instructor/Settings";
import Course from "../pages/student/Course";
import CreateCourse from "../components/instructor/Course/CreateCourse";
import CourseDisplay from "../components/instructor/Course/CourseCard";
import CourseDetails from "../components/instructor/Course/CourseDetails";
import Error404 from "../components/Common/errorPages/Error404";
import UpdateCourse from "../components/instructor/Course/UpdateCourse";
import StudentForgotPassword from "../pages/student/StudentForgotPassword";
import EnterMailForgotPasswordForm from "../components/auth/EnterEmailPassword";
import VerifyOtp from "../pages/student/VerifyOtp";
import InstructorEnterMailForgotPassword from "../pages/instructor/InstructorEnterEmailForgotpassword";
import InstructorForgotPassword from "../pages/instructor/InstructorForgotPassword";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";
import StripeStatus from "../pages/student/StripeStatus";
import MyLearning from "../pages/student/MyLearning";
import SingleEnrolledCoursePage from "../pages/student/SingleEnrolledCourse";
import StudentManagement from "../pages/instructor/StudentManagement";
import AdminLayout from "../pages/admin/AdminLayout.tsx";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";
import StudentList from "../components/admin/StudentManagement/StudentList.tsx";
import InstructorList from "../components/admin/InstructorManagement/InstructorList.tsx";
import AdminCourses from "../components/admin/CourseManagement/CourseList.tsx";
import SingleCourseViewAdmin from "../components/admin/CourseManagement/SingleCourse.tsx";
import WalletTransactions from "../components/instructor/Wallet/Transactions.tsx";
import Enrollments from "../components/admin/EnrolledCourses/Enrollments.tsx";
import AdminCategories from "../components/admin/CategoryManagement/category.tsx";
import SearchCourses from "../pages/student/SearchCourse.tsx";
import ForgotPasswordOtpVerificationForm from "../components/auth/ForgotPasswordOtp.tsx";


const StudentHomeLazy = React.lazy(() => import("../pages/student/StudentHome"));
const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));


const RoutePage = () => {
  return (
    <Suspense
      fallback={
        <div className="spinner-container">
          <ClipLoader color="#00008b" size={40} />
        </div>
      }
    >
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentHomeLazy />} />
        <Route path="/verifyOtp" element={<VerifyOtpLazy isForgotPassword={false} isInstructor={false} />} />
        <Route path="/update-forgot-password" element={<AuthProtected element={<StudentForgotPassword />} />} />
        <Route path="/forgot-password" element={<AuthProtected element={<EnterMailForgotPasswordForm isInstructor={false} />} />} />
        <Route path="/forgot-password-otp-verfication" element={<AuthProtected element={<ForgotPasswordOtpVerificationForm isInstructor={false} />} />} />
        <Route path="/status" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<StripeStatus />} />} />
        <Route path="/myLearning" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<MyLearning />} />} />
        <Route path="/singleEnrolledCourse/:courseId" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<SingleEnrolledCoursePage />} />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/searchCourses" element={<SearchCourses/>} />

        <Route path="/courseDetails/:courseId" element={<StudentCourseDetails />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<Profile />} />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<ProtectedRoute element={<InstructorLayout />}/>}>
          <Route index element={<ProtectedRoute element={<Dashboard />} />}  />
          <Route path="forgot-password" element={<AuthProtected element={<InstructorEnterMailForgotPassword />} />} />
          <Route path="forgot-password-otp-verfication" element={<AuthProtected element={<VerifyOtp isForgotPassword={true} isInstructor={true} />} />} />
          <Route path="update-forgot-password" element={<AuthProtected element={<InstructorForgotPassword />} />} />
          <Route path="instructorProfile" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<InstructorProfile />} />} />
          <Route path="courses" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDisplay />} />} />
          <Route path="settings" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<Settings />} />} />
          <Route path="createCourse" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CreateCourse />} />} />
          <Route path="courseDetails/:courseId" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDetails />} />} />
          <Route path="updateCourse/:courseId" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<UpdateCourse />} />} />
          <Route path="studentDetails" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<StudentManagement />} />} />
          <Route path="transactions" element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={< WalletTransactions/>} />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="studentDetails" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<StudentList />} />} />
          <Route path="instructors" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<InstructorList />} />} />
          <Route path="categories" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCategories />} />} />
          <Route path="courses" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCourses />} />} />
          <Route path="course/:courseId" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<SingleCourseViewAdmin />} />} />
          <Route path="enrollments" element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<Enrollments />} />} />
        </Route>

        {/* Error Routes */}
        <Route path="error404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default RoutePage;


// import React, { Suspense } from "react";
// import { Routes, Route } from "react-router-dom";
// import { ClipLoader } from "react-spinners";
// import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
// import AuthProtected from "../components/Common/protectedRoutes/AuthProtectedRoles";
// import { Roles } from "../interfaces/Roles";

// const AdminLoginLazy = React.lazy(() => import("../components/auth/adminLogin"));
// const ProfileLazy = React.lazy(() => import("../pages/student/Profile"));
// const DashboardLazy = React.lazy(() => import("../pages/instructor/Dashboard"));
// const InstructorLayoutLazy = React.lazy(() => import("../pages/instructor/InstructorLayout"));
// const InstructorProfileLazy = React.lazy(() => import("../pages/instructor/InstructorProfile"));
// const SettingsLazy = React.lazy(() => import("../pages/instructor/Settings"));
// const CourseLazy = React.lazy(() => import("../pages/student/Course"));
// const CreateCourseLazy = React.lazy(() => import("../components/instructor/Course/CreateCourse"));
// const CourseDisplayLazy = React.lazy(() => import("../components/instructor/Course/CourseCard"));
// const CourseDetailsLazy = React.lazy(() => import("../components/instructor/Course/CourseDetails"));
// const Error404Lazy = React.lazy(() => import("../components/Common/errorPages/Error404"));
// const UpdateCourseLazy = React.lazy(() => import("../components/instructor/Course/UpdateCourse"));
// const StudentForgotPasswordLazy = React.lazy(() => import("../pages/student/StudentForgotPassword"));
// const EnterMailForgotPasswordFormLazy = React.lazy(() => import("../components/auth/EnterEmailPassword"));
// const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));
// const InstructorEnterMailForgotPasswordLazy = React.lazy(() =>
//   import("../pages/instructor/InstructorEnterEmailForgotpassword")
// );
// const InstructorForgotPasswordLazy = React.lazy(() => import("../pages/instructor/InstructorForgotPassword"));
// const StudentCourseDetailsLazy = React.lazy(() => import("../pages/student/StudentCourseDetails"));
// const StripeStatusLazy = React.lazy(() => import("../pages/student/StripeStatus"));
// const MyLearningLazy = React.lazy(() => import("../pages/student/MyLearning"));
// const SingleEnrolledCoursePageLazy = React.lazy(() => import("../pages/student/SingleEnrolledCourse"));
// const StudentManagementLazy = React.lazy(() => import("../pages/instructor/StudentManagement"));
// const AdminLayoutLazy = React.lazy(() => import("../pages/admin/AdminLayout"));
// const AdminDashboardLazy = React.lazy(() => import("../pages/admin/AdminDashboard"));
// const StudentListLazy = React.lazy(() => import("../components/admin/StudentManagement/StudentList"));
// const InstructorListLazy = React.lazy(() => import("../components/admin/InstructorManagement/InstructorList"));
// const AdminCoursesLazy = React.lazy(() => import("../components/admin/CourseManagement/CourseList"));
// const SingleCourseViewAdminLazy = React.lazy(() => import("../components/admin/CourseManagement/SingleCourse"));
// const WalletTransactionsLazy = React.lazy(() => import("../components/instructor/Wallet/Transactions"));
// const EnrollmentsLazy = React.lazy(() => import("../components/admin/EnrolledCourses/Enrollments"));
// const AdminCategoriesLazy = React.lazy(() => import("../components/admin/CategoryManagement/category"));
// const SearchCoursesLazy = React.lazy(() => import("../pages/student/SearchCourse"));
// const StudentHomeLazy = React.lazy(() => import("../pages/student/StudentHome"));

// const RoutePage = () => {
//   return (
//     <Suspense
//       fallback={
//         <div className="spinner-container">
//           <ClipLoader color="#00008b" size={40} />
//         </div>
//       }
//     >
//       <Routes>
//         {/* Student Routes */}
//         <Route path="/" element={<StudentHomeLazy />} />
//         <Route path="/verifyOtp" element={<VerifyOtpLazy isForgotPassword={true} isInstructor={false} />} />
//         <Route
//           path="/update-forgot-password"
//           element={<AuthProtected element={<StudentForgotPasswordLazy />} />}
//         />
//         <Route
//           path="/forgot-password"
//           element={<AuthProtected element={<EnterMailForgotPasswordFormLazy isInstructor={false} />} />}
//         />
//         <Route
//           path="/forgot-password-otp-verfication"
//           element={<AuthProtected element={<VerifyOtpLazy isForgotPassword={true} isInstructor={false} />} />}
//         />
//         <Route path="/status" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<StripeStatusLazy />} />} />
//         <Route
//           path="/myLearning"
//           element={<ProtectedRoute allowedRoles={[Roles.student]} element={<MyLearningLazy />} />}
//         />
//         <Route
//           path="/singleEnrolledCourse/:courseId"
//           element={<ProtectedRoute allowedRoles={[Roles.student]} element={<SingleEnrolledCoursePageLazy />} />}
//         />
//         <Route path="/courses" element={<CourseLazy />} />
//         <Route path="/searchCourses" element={<SearchCoursesLazy />} />
//         <Route path="/courseDetails/:courseId" element={<StudentCourseDetailsLazy />} />
//         <Route
//           path="/profile"
//           element={<ProtectedRoute allowedRoles={[Roles.student]} element={<ProfileLazy />} />}
//         />

//         {/* Instructor Routes */}
//         <Route path="/instructor" element={<ProtectedRoute element={<InstructorLayoutLazy />} />}>
//           <Route index element={<ProtectedRoute element={<DashboardLazy />} />} />
//           <Route
//             path="forgot-password"
//             element={<AuthProtected element={<InstructorEnterMailForgotPasswordLazy />} />}
//           />
//           <Route
//             path="forgot-password-otp-verfication"
//             element={<AuthProtected element={<VerifyOtpLazy isForgotPassword={true} isInstructor={true} />} />}
//           />
//           <Route
//             path="update-forgot-password"
//             element={<AuthProtected element={<InstructorForgotPasswordLazy />} />}
//           />
//           <Route
//             path="instructorProfile"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<InstructorProfileLazy />} />}
//           />
//           <Route
//             path="courses"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDisplayLazy />} />}
//           />
//           <Route
//             path="settings"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<SettingsLazy />} />}
//           />
//           <Route
//             path="createCourse"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CreateCourseLazy />} />}
//           />
//           <Route
//             path="courseDetails/:courseId"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDetailsLazy />} />}
//           />
//           <Route
//             path="updateCourse/:courseId"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<UpdateCourseLazy />} />}
//           />
//           <Route
//             path="studentDetails"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<StudentManagementLazy />} />}
//           />
//           <Route
//             path="transactions"
//             element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<WalletTransactionsLazy />} />}
//           />
//         </Route>

//         {/* Admin Routes */}
//         <Route path="/admin/login" element={<AdminLoginLazy />} />
//         <Route path="/admin" element={<AdminLayoutLazy />}>
//           <Route index element={<AdminDashboardLazy />} />
//           <Route
//             path="studentDetails"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<StudentListLazy />} />}
//           />
//           <Route
//             path="instructors"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<InstructorListLazy />} />}
//           />
//           <Route
//             path="categories"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCategoriesLazy />} />}
//           />
//           <Route
//             path="courses"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCoursesLazy />} />}
//           />
//           <Route
//             path="course/:courseId"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<SingleCourseViewAdminLazy />} />}
//           />
//           <Route
//             path="enrollments"
//             element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<EnrollmentsLazy />} />}
//           />
//         </Route>

//         {/* Error Routes */}
//         <Route path="error404" element={<Error404Lazy />} />
//         <Route path="*" element={<Error404Lazy />} />
//       </Routes>
//     </Suspense>
//   );
// };

// export default RoutePage;
