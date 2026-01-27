import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StayContext } from "../context/StayContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(StayContext);

  // Not logged in
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "owner") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/userpage" replace />;
  }

  // Otherwise, allow access
  return children;
}
