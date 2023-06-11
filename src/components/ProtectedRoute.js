import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtctedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
}
