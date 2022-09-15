import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Newsletter from "../components/Newsletter";
import {
  changeDressQuantity,
  fetchCartContent,
  removeCart,
  removeCartItem,
  setCartTotal,
} from "../redux/actions/fetchers";
import "./cart.css";
import emptyCart from "../images/empty-cart.png";
import { useSelector } from "react-redux";
import Error from "../components/Error";

const Cart = () => {
  const storeContext = useSelector((state) => state.dress);
  const { backendUrl, cartDataToRender, cartCount, cartTotal, noInternet } =
    storeContext;
  const changeQuantity = (id, quantity, action) => {
    if (quantity < 5 && action === "increase") {
      changeDressQuantity(id, quantity, "increase");
    } else if (quantity !== 1 && action === "decrease") {
      changeDressQuantity(id, quantity, "decrease");
    }
  };

  const renderCartData = () => {
    if (cartCount === 0) {
      return (
        <div className="col-md-12 empty__cart">
          <div className="empty__cart_wrapper">
            <img src={emptyCart} alt="empty-cart" className="img-fluid" />
          </div>
          <h3>Cart is Empty</h3>
          <NavLink to="/shop">Go Shopping</NavLink>
        </div>
      );
    } else {
      return (
        <>
          <div className="col-md-8 cart__item">
            {cartDataToRender.map((dress) => (
              <div key={dress.id}>
                <div className="row item__row mb-3">
                  <div className="col-4">
                    <div className="cart__image-wrapper">
                      <NavLink to={`/shop/dress/${dress.slug}`}>
                        <img
                          src={`${backendUrl}${dress.main_image}`}
                          alt={dress.name}
                          className="cart__img img-fluid"
                        />
                      </NavLink>
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
                      onClick={() =>
                        changeQuantity(dress.id, dress.quantity, "increase")
                      }
                      className="fas fa-angle-up"
                    ></i>
                    <p className="item__quantity">{dress.quantity}</p>
                    <i
                      onClick={() =>
                        changeQuantity(dress.id, dress.quantity, "decrease")
                      }
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
                    <p className="total__price">${cartTotal}</p>
                  </div>
                  <button
                    onClick={() => removeCart()}
                    className="btn clear__cart"
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
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchCartContent();
  }, [cartCount, cartTotal]);

  useEffect(() => {
    setCartTotal(cartDataToRender);
  }, [cartDataToRender]);

  if (noInternet) {
    return <Error />;
  }

  return (
    <>
      <div className="container">
        <h2 className="title__caption">Cart</h2>
        <hr className="underline" />
        <>
          <div className="row">{renderCartData()}</div>
        </>
        <Newsletter />
      </div>
    </>
  );
};

export default Cart;
