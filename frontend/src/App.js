import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SingleProduct from "./pages/SingleProduct";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import CartIcon from "./components/CartIcon";
import Footer from "./components/Footer";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./PrivateRoute";
import fetchUser from "./redux/actions/auth";
import { fetchCartCount } from "./redux/actions/fetchers";
import store from "./redux/store/store";
import { setLoginUser } from "./redux/actions/dressActions";
import TrackOrder from "./pages/TrackOrder";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const getUserUrl = "http://localhost:8000/api/auth/user/";

  useEffect(() => {
    let data = fetchUser(getUserUrl, (status) => {
      store.dispatch(setLoginUser(status));
    });
    fetchCartCount();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/dress/:dressSlug" element={<SingleProduct />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/shop/checkout" element={<Checkout />} />
        <Route path="/user/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {/* <CartIcon /> */}
      <Footer />
    </Router>
  );
};

export default App;
