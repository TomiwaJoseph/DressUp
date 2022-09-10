import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { signUpUser } from "../redux/actions/fetchers";

const SignUp = () => {
  const storeContext = useSelector((state) => state.dress);
  const { fetchingData, noInternet, isAuthenticated } = storeContext;
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const notify = (message, errorType) =>
    toast(message, {
      position: "top-center",
      autoClose: "3000",
      pauseOnHover: true,
      closeOnClick: true,
      type: errorType,
      theme: "colored",
    });

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      notify("Both passwords don't match", "error");
    } else {
      signUpUser([firstName, lastName, email, password]);
    }
  };

  if (isAuthenticated) {
    return navigate("/");
  }

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container text-center mt-5">
      <ToastContainer />
      <h2 className="title__caption">Sign-Up</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-5 mr-auto ml-auto">
          <div className="register__container">
            <form className="register__form" onSubmit={handleSignUpSubmit}>
              <div className="row">
                <div className="col-6">
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    name="firstName"
                    required
                    placeholder="First Name"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    name="lastName"
                    required
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
              </div>
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
              <input
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="form-control"
                name="repeatPassword"
                required
                placeholder="Repeat Password"
                type="password"
              />
              <button className="btn" type="submit">
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
