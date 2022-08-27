import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import dressContext from "../context/dress-context";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { noInternet, signInUser, fetchingData, isAuthenticated } =
    useContext(dressContext);
  const handleLoginForm = (e) => {
    e.preventDefault();
    signInUser([email, password]);
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/cart");
    }
  });

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <div className="container text-center mt-5">
      {/* <ToastContainer /> */}
      <h2 className="title__caption">Login</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-5 mr-auto ml-auto">
          <div className="login__container">
            <form onSubmit={handleLoginForm} className="login__form">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                name="email"
                required
                placeholder="Email"
                type="email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                name="password"
                required
                placeholder="Password"
                type="password"
              />
              <NavLink style={{ pointerEvents: "none" }} to="/">
                Forgot Password?
              </NavLink>
              <button className="btn" type="submit">
                Login
              </button>
            </form>
            <button className="btn demo__user" type="submit">
              Demo User
            </button>
            <div className="mb-2">
              Don't have an account?
              <NavLink to="/sign-up" className="sign-up">
                sign-up
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// // import React from 'react'
// import { useContext, useState } from "react";
// import { NavLink } from "react-router-dom";
// // import "./login.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Error from "../components/Error";
// import Preloader from "../components/Preloader";
// // import dressContext from "../context/dressup-context";

// const Login = () => {
//   const { signInUser, isFetchingData, isError } = useContext(dressContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLoginForm = (e) => {
//     e.preventDefault();
//     signInUser([email, password]);
//   };

//   if (isFetchingData) {
//     return <Preloader />;
//   }

//   if (isError) {
//     return <Error />;
//   }

//   return (
//   );
// };

// export default Login;
