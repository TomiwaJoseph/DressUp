import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import CartItem from "../components/CartItem";
import Newsletter from "../components/Newsletter";
import dressContext from "../context/dress-context";
import "./cart.css";
import emptyCart from "../images/empty-cart.png";

const Cart = () => {
  const {
    backendUrl,
    addToCart,
    getCartItemFromStorage,
    removeCartItem,
    cartDataToRender,
    setCartCount,
  } = useContext(dressContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [dataToRender, setDataToRender] = useState([]);
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
    localStorage.removeItem("cart");
    setCartCount("clean up");
  };

  useEffect(() => {
    let data = getCartItemFromStorage();
    setDataToRender(data);
    setCartTotal(calculateTotal(data));
  }, [cartDataToRender, cartTotal]);

  return (
    <>
      <div className="container">
        <h2 className="title__caption">Cart</h2>
        <hr className="underline" />
        <div className="row">
          {dataToRender.length ? (
            <>
              <div className="col-md-8 cart__item">
                {dataToRender.map((dress) => (
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
                        <p className="item__price">
                          ${dress.price * dress.quantity}
                        </p>
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
                ))}
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
              </div>
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
            </>
          ) : (
            <div className="col-md-12 empty__cart">
              <div className="empty__cart_wrapper">
                <img src={emptyCart} alt="empty-cart" className="img-fluid" />
              </div>
              <h3>Cart is Empty</h3>
              <NavLink to="/shop">Go Shopping</NavLink>
            </div>
          )}
        </div>
        <Newsletter />
      </div>
    </>
  );
};

export default Cart;
