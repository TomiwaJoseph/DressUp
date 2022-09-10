import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import { loginDemoUser, signInUser } from "../redux/actions/fetchers";

const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const storeContext = useSelector((state) => state.dress);
  const { noInternet, fetchingData, isAuthenticated } = storeContext;

  const handleLoginForm = (e) => {
    e.preventDefault();
    if (state) {
      let checkAttachment = state.hasOwnProperty("action");
      if (checkAttachment) {
        return signInUser([email, password, state.id]);
      }
    } else {
      signInUser([email, password]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let previousUrl = state?.previousPath || "/cart";
    if (isAuthenticated) {
      navigate(previousUrl);
    }
  }, [isAuthenticated]);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <div className="container text-center mt-5">
      <h2 className="title__caption">Login</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-7 col-lg-6 mr-auto ml-auto">
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
            <button
              onClick={loginDemoUser}
              className="btn demo__user"
              type="submit"
            >
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
