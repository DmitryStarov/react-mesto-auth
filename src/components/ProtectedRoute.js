import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtctedRoute({ element: Component, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
}
