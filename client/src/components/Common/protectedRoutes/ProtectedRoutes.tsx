import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Navigate } from "react-router-dom";
import { Roles } from "../../../interfaces/Roles";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: Roles[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
    const { user } = useSelector((store: RootState) => store.user);
  if (!user) {
    return <Navigate to={"/"} replace />;
  }
  const userRole = user.role as Roles;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (user.role === Roles.student) {
      return <Navigate to="/" replace={true} />;
    }
    if (user.role === Roles.instructor) {
      return <Navigate to="/instructor" replace={true} />;
    }
    if (user.role === Roles.admin) {
      return <Navigate to="/admin" replace={true} />;
    }
  }

  return <>{element}</>;
};

export default ProtectedRoute;