// import React from 'react'
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [action, setAction] = useState("login");
  const handleLoginChange = (action) => {
    console.log(action);
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="title__caption">{action}</h2>
      <hr className="underline" />
      <div className="row">
        {action === "login" ? (
          <div className="col-md-5 mr-auto ml-auto">
            <div className="login__container">
              <form className="login__form">
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
                <NavLink to="/shop/forgot-password">Forgot Password?</NavLink>
                <button class="btn" type="submit">
                  Login
                </button>
              </form>
              <button class="btn demo__user" type="submit">
                Demo User
              </button>
              <div className="mb-2">
                Don't have an account?
                <button
                  onClick={() => setAction("sign-up")}
                  className="sign-up"
                >
                  sign-up
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-5 mr-auto ml-auto">
            <div className="register__container">
              <form className="register__form">
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
                <button onClick={() => setAction("login")} className="sign-in">
                  sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
