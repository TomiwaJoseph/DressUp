import "./navbar.css";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCartCount } from "../redux/actions/fetchers";
import { setCartTotalAction } from "../redux/actions/dressActions";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
    if (!click) {
      document.body.style["overflow"] = "hidden";
    } else {
      document.body.style["overflow"] = "auto";
    }
  };
  const closeMobileMenu = () => {
    setClick(false);
    document.body.style["overflow"] = "auto";
  };
  const [scrollDown, setScrollDown] = useState(false);
  const storeContext = useSelector((state) => state.dress);
  const { isAuthenticated, cartCount } = storeContext;

  useEffect(() => {
    const onScroll = (e) => {
      let scroll = window.pageYOffset;
      // console.log(scroll);
      if (scroll > 900) {
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
      <nav className={scrollDown ? "fix__navbar" : null}>
        <NavLink onClick={closeMobileMenu} className="logo" to="/">
          <h2>
            Dress <em>Up</em>
          </h2>
        </NavLink>
        {/* <div className="mobile__icons-container"> */}
        <NavLink to="/search-dress">
          <i
            onClick={closeMobileMenu}
            className="fa fa-search search__mobile-icon"
          ></i>
        </NavLink>
        <i
          onClick={handleClick}
          className={click ? "fa fa-times" : "fa fa-align-right"}
        ></i>
        {/* </div> */}
        <div className={click ? "navMenu active" : "navMenu"}>
          <NavLink
            onClick={closeMobileMenu}
            id="home"
            className="navLink"
            to="/"
          >
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
            <NavLink
              onClick={closeMobileMenu}
              id="login"
              className="navLink"
              to="/login"
            >
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
        <div className="navBrands">
          <NavLink to="/search-dress" className="search__icon navLink">
            <i className="fas fa-search"></i>
          </NavLink>
          <NavLink to="/cart" className="cartIcon navLink">
            <div className="cart__wrapper">
              <i className="fas fa-shopping-cart"></i>
              <span>{cartCount}</span>
            </div>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
