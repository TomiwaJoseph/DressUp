// import React from 'react'
import "./footer.css";
import cards from "../images/cards.png";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <h2>
          Dress<em>up</em>
        </h2>
        <div className="footer__cta">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink style={{ pointerEvents: "none" }} to="/">
            Privacy Policy
          </NavLink>
          <Link style={{ pointerEvents: "none" }} to="/">
            How It Works?
          </Link>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact-us">Contact Us</NavLink>
        </div>
        <div className="footer__social-media">
          <i className="fab fa-github"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-pinterest"></i>
        </div>
        {/* <div className="row">
          <div className="col-md-4 mt-4">
            <h3>About Us</h3>
            <hr className="foot_hr" />
            <p>
              We offer many payment methods. Try us today, you won't regret it.
            </p>
            <img src={cards} alt="Cards" />
          </div>
          <div className="col-md-4 mt-4 social__col">
            <h3>Social Media</h3>
            <hr className="foot_hr" />
            <div className="social-media">
              <i className="fab fa-github"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-pinterest"></i>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <h3>Newsletter</h3>
            <hr className="foot_hr" />
            <form className="newsletter-box" method="POST">
              <div className="form-group">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  className="form-control"
                />
                <i className="fas fa-envelope"></i>
              </div>
              <button className="btn" type="submit" id="newsletter_btn">
                Submit
              </button>
            </form>
          </div>
        </div> */}
      </div>
      <hr className="last_hr" />
      <div className="copyright">
        <p>Copyright &copy;2022 TomiwaJoseph &hearts;</p>
      </div>
    </footer>
  );
};

export default Footer;
