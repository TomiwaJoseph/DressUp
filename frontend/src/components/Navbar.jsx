import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import dressContext from "../context/dress-context";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [scrollDown, setScrollDown] = useState(false);
  const { cartCount, isAuthenticated } = useContext(dressContext);

  useEffect(() => {
    const onScroll = (e) => {
      let scroll = window.pageYOffset;
      //   console.log(scroll);
      if (scroll > 670) {
        // console.log("scorlled past 500");
        setScrollDown(true);
      } else {
        setScrollDown(false);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollDown]);

  return (
    <>
      <nav className={scrollDown ? "fix__navbars" : null}>
        <NavLink onClick={closeMobileMenu} className="logo" to="/">
          <h2>
            Dress <em>Up</em>
          </h2>
        </NavLink>
        <i
          onClick={handleClick}
          className={click ? "fa fa-times" : "fa fa-align-right"}
        ></i>
        <div className={click ? "navMenu active" : "navMenu"}>
          <NavLink onClick={closeMobileMenu} className="navLink" to="/">
            Home
          </NavLink>
          <NavLink onClick={closeMobileMenu} className="navLink" to="/shop">
            Shop
          </NavLink>
          <NavLink onClick={closeMobileMenu} className="navLink" to="/cart">
            Cart
          </NavLink>
          <NavLink
            onClick={closeMobileMenu}
            className="navLink"
            to="/contact-us"
          >
            Contact
          </NavLink>
          {isAuthenticated ? (
            <NavLink
              onClick={closeMobileMenu}
              className="navLink"
              to="/user/dashboard"
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink onClick={closeMobileMenu} className="navLink" to="/login">
              Login
            </NavLink>
          )}
          <div className="mobileLink">
            {click ? (
              <>
                <a
                  onClick={closeMobileMenu}
                  className="nav-brands-mobile"
                  rel="noreferrer"
                  target="_blank"
                  href="https://github.com/TomiwaJoseph"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  onClick={closeMobileMenu}
                  className="nav-brands-mobile"
                  target="_blank"
                  href="/"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  onClick={closeMobileMenu}
                  className="nav-brands-mobile"
                  target="_blank"
                  href="/"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              </>
            ) : null}
          </div>
        </div>
        <NavLink to="/cart" className="cartIcon navLink">
          <div className="navBrands">
            <div className="cart__wrapper">
              <i className="fas fa-shopping-cart"></i>
              <span>{cartCount}</span>
            </div>
          </div>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
