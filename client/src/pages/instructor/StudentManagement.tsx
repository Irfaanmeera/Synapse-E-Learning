import TableOne from "../../components/instructor/Tables/StudentList.tsx";
import Breadcrumb from "../../components/instructor/Breadcrumbs/Breadcrumb";

const StudentManagement = () => {
  return (
    <div>
      <Breadcrumb pageName="StudentDetails" />
      <TableOne />
    </div>
  );
};

export default StudentManagement;
