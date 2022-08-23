// import React from 'react'
import { Component, useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import dressContext from "./context/dressup-context";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(dressContext);
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
