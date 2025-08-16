 import React from "react";
 import { Navigate } from "react-router-dom";
  const ProtectedRoute = ({ children, role }) => {
    const isAuthenticated = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); 
     if (!isAuthenticated) {
       return <Navigate to="/signin"/>;
     }
     if (role && userRole !== role) {
       return <Navigate to="/" />;
      }
    return children;
 };
 export default ProtectedRoute

