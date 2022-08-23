// import React from 'react'
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CartItem from "../components/CartItem";
import dressContext from "../context/dressup-context";
import "./cart.css";

const Cart = () => {
  const { cartCount, getCartItemFromStorage } = useContext(dressContext);
  const [cartContent, setCartContent] = useState([]);

  useEffect(() => {
    let cartData = getCartItemFromStorage();
    setCartContent(cartData);
  }, []);
  return (
    <>
      <div className="container">
        <h2 className="title__caption">Cart</h2>
        <hr className="underline" />
        <div className="row">
          <div
            className={
              cartContent ? "col-md-8 cart__item" : "col-md-12 cart_item"
            }
          >
            <CartItem />
          </div>
          {cartContent ? (
            <div className="col-md-4 col__row">
              <div className="cta__links">
                <NavLink to="/shop/checkout" className="cta__link-checkout">
                  Checkout
                </NavLink>
                <NavLink to="/shop" className="cta__link-shop">
                  Continue Shopping
                </NavLink>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Cart;
