import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Error from "../components/Error";
import dressContext from "../context/dressup-context";

const Dashboard = () => {
  const { logOutUser, isError, isAuthenticated } = useContext(dressContext);
  const handleLogoutClick = () => {
    logOutUser();
  };

  useEffect(() => {
    let getIsAuthenticated = isAuthenticated;
    console.log(getIsAuthenticated);
  }, []);

  //   if (!isAuthenticated) {
  //     return <Navigate to="/" />;
  //   }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <button onClick={handleLogoutClick} className="btn">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
