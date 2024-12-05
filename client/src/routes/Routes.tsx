import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/Common/protectedRoutes/ProtectedRoutes";
import AuthProtected from "../components/Common/protectedRoutes/AuthProtectedRoles";
import { Roles } from "../interfaces/Roles";

const AdminLoginLazy = React.lazy(() => import("../components/auth/adminLogin"));
const ProfileLazy = React.lazy(() => import("../pages/student/Profile"));
const DashboardLazy = React.lazy(() => import("../pages/instructor/Dashboard"));
const InstructorLayoutLazy = React.lazy(() => import("../pages/instructor/InstructorLayout"));
const InstructorProfileLazy = React.lazy(() => import("../pages/instructor/InstructorProfile"));
const SettingsLazy = React.lazy(() => import("../pages/instructor/Settings"));
const CourseLazy = React.lazy(() => import("../pages/student/Course"));
const CreateCourseLazy = React.lazy(() => import("../components/instructor/Course/CreateCourse"));
const CourseDisplayLazy = React.lazy(() => import("../components/instructor/Course/CourseCard"));
const CourseDetailsLazy = React.lazy(() => import("../components/instructor/Course/CourseDetails"));
const Error404Lazy = React.lazy(() => import("../components/Common/errorPages/Error404"));
const UpdateCourseLazy = React.lazy(() => import("../components/instructor/Course/UpdateCourse"));
const StudentForgotPasswordLazy = React.lazy(() => import("../pages/student/StudentForgotPassword"));
const EnterMailForgotPasswordFormLazy = React.lazy(() => import("../components/auth/EnterEmailPassword"));
const VerifyOtpLazy = React.lazy(() => import("../pages/student/VerifyOtp"));
const InstructorEnterMailForgotPasswordLazy = React.lazy(() =>
  import("../pages/instructor/InstructorEnterEmailForgotpassword")
);
const InstructorForgotPasswordLazy = React.lazy(() => import("../pages/instructor/InstructorForgotPassword"));
const StudentCourseDetailsLazy = React.lazy(() => import("../pages/student/StudentCourseDetails"));
const StripeStatusLazy = React.lazy(() => import("../pages/student/StripeStatus"));
const MyLearningLazy = React.lazy(() => import("../pages/student/MyLearning"));
const SingleEnrolledCoursePageLazy = React.lazy(() => import("../pages/student/SingleEnrolledCourse"));
const StudentManagementLazy = React.lazy(() => import("../pages/instructor/StudentManagement"));
const AdminLayoutLazy = React.lazy(() => import("../pages/admin/AdminLayout"));
const AdminDashboardLazy = React.lazy(() => import("../pages/admin/AdminDashboard"));
const StudentListLazy = React.lazy(() => import("../components/admin/StudentManagement/StudentList"));
const InstructorListLazy = React.lazy(() => import("../components/admin/InstructorManagement/InstructorList"));
const AdminCoursesLazy = React.lazy(() => import("../components/admin/CourseManagement/CourseList"));
const SingleCourseViewAdminLazy = React.lazy(() => import("../components/admin/CourseManagement/SingleCourse"));
const WalletTransactionsLazy = React.lazy(() => import("../components/instructor/Wallet/Transactions"));
const EnrollmentsLazy = React.lazy(() => import("../components/admin/EnrolledCourses/Enrollments"));
const AdminCategoriesLazy = React.lazy(() => import("../components/admin/CategoryManagement/category"));
const SearchCoursesLazy = React.lazy(() => import("../pages/student/SearchCourse"));
const StudentHomeLazy = React.lazy(() => import("../pages/student/StudentHome"));

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
        <Route path="/verifyOtp" element={<VerifyOtpLazy isForgotPassword={true} isInstructor={false} />} />
        <Route
          path="/update-forgot-password"
          element={<AuthProtected element={<StudentForgotPasswordLazy />} />}
        />
        <Route
          path="/forgot-password"
          element={<AuthProtected element={<EnterMailForgotPasswordFormLazy isInstructor={false} />} />}
        />
        <Route
          path="/forgot-password-otp-verfication"
          element={<AuthProtected element={<VerifyOtpLazy isForgotPassword={true} isInstructor={false} />} />}
        />
        <Route path="/status" element={<ProtectedRoute allowedRoles={[Roles.student]} element={<StripeStatusLazy />} />} />
        <Route
          path="/myLearning"
          element={<ProtectedRoute allowedRoles={[Roles.student]} element={<MyLearningLazy />} />}
        />
        <Route
          path="/singleEnrolledCourse/:courseId"
          element={<ProtectedRoute allowedRoles={[Roles.student]} element={<SingleEnrolledCoursePageLazy />} />}
        />
        <Route path="/courses" element={<CourseLazy />} />
        <Route path="/searchCourses" element={<SearchCoursesLazy />} />
        <Route path="/courseDetails/:courseId" element={<StudentCourseDetailsLazy />} />
        <Route
          path="/profile"
          element={<ProtectedRoute allowedRoles={[Roles.student]} element={<ProfileLazy />} />}
        />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<ProtectedRoute element={<InstructorLayoutLazy />} />}>
          <Route index element={<ProtectedRoute element={<DashboardLazy />} />} />
          <Route
            path="forgot-password"
            element={<AuthProtected element={<InstructorEnterMailForgotPasswordLazy />} />}
          />
          <Route
            path="forgot-password-otp-verfication"
            element={<AuthProtected element={<VerifyOtpLazy isForgotPassword={true} isInstructor={true} />} />}
          />
          <Route
            path="update-forgot-password"
            element={<AuthProtected element={<InstructorForgotPasswordLazy />} />}
          />
          <Route
            path="instructorProfile"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<InstructorProfileLazy />} />}
          />
          <Route
            path="courses"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDisplayLazy />} />}
          />
          <Route
            path="settings"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<SettingsLazy />} />}
          />
          <Route
            path="createCourse"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CreateCourseLazy />} />}
          />
          <Route
            path="courseDetails/:courseId"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<CourseDetailsLazy />} />}
          />
          <Route
            path="updateCourse/:courseId"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<UpdateCourseLazy />} />}
          />
          <Route
            path="studentDetails"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<StudentManagementLazy />} />}
          />
          <Route
            path="transactions"
            element={<ProtectedRoute allowedRoles={[Roles.instructor]} element={<WalletTransactionsLazy />} />}
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginLazy />} />
        <Route path="/admin" element={<AdminLayoutLazy />}>
          <Route index element={<AdminDashboardLazy />} />
          <Route
            path="studentDetails"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<StudentListLazy />} />}
          />
          <Route
            path="instructors"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<InstructorListLazy />} />}
          />
          <Route
            path="categories"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCategoriesLazy />} />}
          />
          <Route
            path="courses"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<AdminCoursesLazy />} />}
          />
          <Route
            path="course/:courseId"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<SingleCourseViewAdminLazy />} />}
          />
          <Route
            path="enrollments"
            element={<ProtectedRoute allowedRoles={[Roles.admin]} element={<EnrollmentsLazy />} />}
          />
        </Route>

        {/* Error Routes */}
        <Route path="error404" element={<Error404Lazy />} />
        <Route path="*" element={<Error404Lazy />} />
      </Routes>
    </Suspense>
  );
};

export default RoutePage;
