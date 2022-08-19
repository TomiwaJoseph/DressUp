// import React from 'react'
import { useContext, useEffect, useState } from "react";
import dressContext from "../context/dressup-context";
import emptyCart from "../images/empty-cart.png";
import { NavLink } from "react-router-dom";

const CartItem = () => {
  const calculateTotal = (cartData) => {
    let allQuantities = cartData.map((item) => item.quantity);
    let getPrices = cartData.map((item) => item.price);
    let multiply = getPrices
      .map((price, index) => price * allQuantities[index])
      .reduce(function (x, y) {
        return x + y;
      }, 0);
    return multiply;
  };
  const {
    cartCount,
    backendUrl,
    getCartItemFromStorage,
    removeCartItem,
    cartDataToRender,
    setCartCount,
    addToCart,
  } = useContext(dressContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [dataToRender, setDataToRender] = useState([]);
  const increaseQuantity = (id) => {
    let data = getCartItemFromStorage();
    let getDress = data.filter((item) => item.id === id)[0];
    addToCart(
      getDress.id,
      getDress.name,
      getDress.price,
      getDress.quantity < 5 ? getDress.quantity + 1 : getDress.quantity,
      getDress.main_image
    );
    let newData = getCartItemFromStorage();
    setCartTotal(calculateTotal(newData));
  };
  const decreaseQuantity = (id) => {
    let data = getCartItemFromStorage();
    let getDress = data.filter((item) => item.id === id)[0];
    addToCart(
      getDress.id,
      getDress.name,
      getDress.price,
      getDress.quantity !== 1 ? getDress.quantity - 1 : getDress.quantity,
      getDress.main_image
    );
    let newData = getCartItemFromStorage();
    setCartTotal(calculateTotal(newData));
  };
  const clearCart = () => {
    localStorage.setItem("cart", []);
    setCartCount(0);
  };

  useEffect(() => {
    let data = getCartItemFromStorage();
    setDataToRender(data);
    setCartTotal(calculateTotal(data));
    // console.log(calculateTotal(data));
  }, [cartDataToRender, cartTotal]);

  return (
    <>
      {cartCount ? (
        dataToRender.map((dress) => (
          <div key={dress.id}>
            <div className="row item__row mb-3">
              <div className="col-4">
                <div className="cart__image-wrapper">
                  <img
                    src={`${backendUrl}${dress.main_image}`}
                    alt={dress.name}
                    className="cart__img img-fluid"
                  />
                </div>
              </div>
              <div className="col-6 cart__item__details">
                <p className="item__name">{dress.name}</p>
                <p className="item__price">${dress.price * dress.quantity}</p>
                <p
                  onClick={() => removeCartItem(dress.id)}
                  className="item__remove"
                >
                  remove
                </p>
              </div>
              <div className="col-2 incre__decre">
                <i
                  onClick={() => increaseQuantity(dress.id)}
                  className="fas fa-angle-up"
                ></i>
                <p className="item__quantity">{dress.quantity}</p>
                <i
                  onClick={() => decreaseQuantity(dress.id)}
                  className="fas fa-angle-down"
                ></i>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 empty__cart">
          <div className="empty__cart_wrapper">
            <img src={emptyCart} alt="empty-cart" className="img-fluid" />
          </div>
          <h3>Cart is Empty</h3>
          <NavLink to="/shop">Go Shopping</NavLink>
        </div>
      )}
      {cartCount ? (
        <>
          <div className="row">
            <div className="col-12">
              <div>
                <hr className="" />
                <div className="total__div">
                  <p className="total">Grand Total</p>
                  <p className="total__price">${cartTotal}.00</p>
                </div>
                <button
                  onClick={() => clearCart()}
                  className="btn btn-outline-danger"
                >
                  CLEAR CART
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CartItem;
