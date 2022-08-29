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
// import CartIcon from "./components/CartIcon";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import Preloader from "./components/Preloader";
// import DressUpState from "./context/DressUpState";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
// import dressContext from "./context/dressup-context";
import fetchUser from "./context/auth";
import DressState from "./context/DressState";
import dressReducer from "./context/dress-reducer";

const App = () => {
  const getUserUrl = "http://localhost:8000/api/auth/user/";
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let data = fetchUser(getUserUrl, (status) => {
      setIsAuthenticated(status);
    });
  }, []);

  return (
    <Router>
      <DressState isAuth={isAuthenticated}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/dress/:dressSlug" element={<SingleProduct />} />
          <Route path="/shop" element={<Shop />} />
          {/* <Route
            path="/user/dashboard"
            element={
              <PrivateRoute auth={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }
          /> */}
          <Route path="/user/dashboard" element={<Dashboard />} />
          {/* <Route
            path="/shop/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          /> */}
          {/* <Route path="/shop/category/:slug" element={<Category />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
        {/* <CartIcon /> */}
        <Footer />
      </DressState>
    </Router>
  );
};

export default App;
