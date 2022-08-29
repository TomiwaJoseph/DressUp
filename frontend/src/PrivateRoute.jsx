import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import dressContext from "./context/dress-context";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, getUser } = useContext(dressContext);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  if (isAuthenticated) {
    return children;
  }
  // return children;
};

export default PrivateRoute;
