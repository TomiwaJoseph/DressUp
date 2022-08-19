// import React from 'react'
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import dressContext from "../context/dressup-context";
import "./signup.css";

const SignUp = () => {
  const { backendUrl } = useContext(dressContext);
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    console.log("sign up submitted");
    // fetch(backendUrl);
  };
  return (
    <div className="container text-center mt-5">
      <h2 className="title__caption">Sign-Up</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-5 mr-auto ml-auto">
          <div className="register__container">
            <form className="register__form" onSubmit={handleSignUpSubmit}>
              <div className="row">
                <div className="col-6">
                  <input
                    className="form-control"
                    name="firstName"
                    required
                    placeholder="First Name"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
              </div>
              <input
                className="form-control"
                name="email"
                required
                placeholder="Email"
                type="email"
              />
              <input
                className="form-control"
                name="password"
                required
                placeholder="Password"
                type="password"
              />
              <input
                className="form-control"
                name="repeatPassword"
                required
                placeholder="Repeat Password"
                type="password"
              />
              <button class="btn" type="submit">
                Sign Up
              </button>
            </form>
            <div>
              Already have an account?
              <NavLink to="/login" className="sign-in">
                sign in
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
