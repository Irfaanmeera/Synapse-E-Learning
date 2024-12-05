import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Roles } from "../../../interfaces/Roles";
import { Navigate } from "react-router-dom";

interface AuthProtectedRoutesProps {
  element: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedRoutesProps> = ({ element }) => {
  const user = useSelector((store: RootState) => store.user.user);
  if (user) {
    if (user.role === Roles.student) {
      return <Navigate to="/" replace />;
    }
    if (user.role === Roles.instructor) {
      return <Navigate to="/instructor" replace />;
    }
    if (user.role === Roles.admin) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{element}</>;
};

export default AuthProtected;