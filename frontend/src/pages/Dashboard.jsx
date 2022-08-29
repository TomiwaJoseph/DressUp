import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import fetchUser from "../context/auth";
import dressContext from "../context/dress-context";

const Dashboard = () => {
  const getUserUrl = "http://localhost:8000/api/auth/user/";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logOutUser, fetchingData, noInternet } = useContext(dressContext);
  const handleLogoutClick = () => {
    logOutUser();
  };
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  let a = "null";
  let b = "undefined";
  let c = false;

  // console.log((a !== null || b !== undefined) && c === false);

  // useEffect(() => {
  //   console.log(isAuthenticated);
  // }, [isAuthenticated]);

  console.log(isAuthenticated);
  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated !== null || isAuthenticated !== undefined) {
      if (isAuthenticated === false) {
        return navigate("/login", { state: { previousPath: pathname } });
      }
    }
  }, [isAuthenticated]);

  // console.log(
  //   isAuthenticated !== null ||
  //     isAuthenticated !== undefined ||
  //     isAuthenticated !== true
  // );
  // useEffect(() => {
  //   console.log(isAuthenticated);
  //   if (
  //     (isAuthenticated !== null || isAuthenticated !== undefined) &&
  //     isAuthenticated === false
  //   ) {
  //     return navigate("/login", { state: { previousPath: pathname } });
  //   }
  // }, [isAuthenticated]);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
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

// import React, { useContext, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import Error from "../components/Error";
// // import dressContext from "../context/dressup-context";

// const Dashboard = () => {
//   const { logOutUser, isError, isAuthenticated } = useContext(dressContext);
//   const handleLogoutClick = () => {
//     logOutUser();
//   };

//   useEffect(() => {
//     let getIsAuthenticated = isAuthenticated;
//     console.log(getIsAuthenticated);
//   }, []);

//   //   if (!isAuthenticated) {
//   //     return <Navigate to="/" />;
//   //   }

//   if (isError) {
//     return <Error />;
//   }

//   return (
//     <div className="container">
//       <h1>Dashboard</h1>
//       <button onClick={handleLogoutClick} className="btn">
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Dashboard;
