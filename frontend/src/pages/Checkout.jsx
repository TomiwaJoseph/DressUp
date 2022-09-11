import { useEffect, useState } from "react";
import "./checkout.css";
import mastercard from "../images/mastercard.png";
import { NavLink } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useSelector } from "react-redux";
import { savePaylaterDetails } from "../redux/actions/fetchers";
import { useLocation, useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import Error from "../components/Error";

const PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(PUBLISHABLE_KEY);

const Checkout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [deliveryType, setDeliveryType] = useState(0);
  const [activeCrumb, setActiveCrumb] = useState(0);
  const [orderInfo, setOrderInfo] = useState([]);
  const handleAddressFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let address = data.get("billing_address");
    let optionalAddress = data.get("billing_address2");
    let phoneNumber = data.get("phone_number");
    let deliveryInfo = data.get("shipping");
    let paymentMethod = data.get("p-method");

    setOrderInfo([address, optionalAddress, phoneNumber, deliveryInfo]);

    if (deliveryInfo === "free") {
      setDeliveryType(0);
    } else {
      setDeliveryType(3.45);
    }

    if (paymentMethod === "Pay when you get the package") {
      savePaylaterDetails([
        address,
        optionalAddress,
        phoneNumber,
        deliveryInfo,
      ]);
    } else {
      setActiveCrumb(1);
    }
  };
  const storeContext = useSelector((state) => state.dress);
  const {
    backendUrl,
    fetchingData,
    noInternet,
    isAuthenticated,
    paylaterStatus,
    cartTotal,
    cartDataToRender,
  } = storeContext;

  const successMessage = () => {
    return (
      <div className="success-msg">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          className="bi bi-check2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <div className="title">Payment Successful</div>
        <NavLink to="/user/dashboard">Track order</NavLink>
      </div>
    );
  };
  const payLaterMessage = () => {
    return (
      <div className="success-msg">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          className="bi bi-check2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <div className="title">Your order is being processed</div>
        <NavLink to="/user/dashboard">Track order</NavLink>
      </div>
    );
  };

  useEffect(() => {
    if (!cartTotal) return navigate("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCrumb]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { previousPath: pathname } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (paylaterStatus) {
    return payLaterMessage();
  }

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <div className="container">
      {paymentCompleted ? (
        successMessage()
      ) : (
        <>
          <h2 className="title__caption">Checkout</h2>
          <hr className="underline" />
          <div className="row">
            <div className="col-md-8 mx-auto mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  onClick={() => setActiveCrumb(0)}
                  className={
                    activeCrumb === 0 ? "btn crumb active" : "btn crumb"
                  }
                >
                  Billing address
                </button>
                <div className="crumb-demarcate"></div>
                <button
                  className={
                    activeCrumb === 1 ? "btn crumb active" : "btn crumb"
                  }
                >
                  Payment details
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            {activeCrumb === 0 && (
              <div className="col-md-8 mx-auto">
                <form
                  onSubmit={handleAddressFormSubmit}
                  className="checkout__form"
                >
                  <div className="billing__address">Billing Address</div>
                  <div className="mb-3">
                    <label htmlFor="billing_address">Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234 Main St"
                      id="billing_address"
                      name="billing_address"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billing_address2">
                      Address 2 <span className="text-muted">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apartment or Suite"
                      id="billing_address2"
                      name="billing_address2"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone_number">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+123 456 789"
                      id="phone_number"
                      name="phone_number"
                      required
                    />
                  </div>
                  <div className="delivery__info">Delivery Info</div>
                  <div className="row shipping-btns">
                    <div className="col-6">
                      <h4>Standard</h4>
                    </div>
                    <div className="col-6">
                      <div className="cf-radio-btns">
                        <div className="cfr-item">
                          <input
                            required
                            type="radio"
                            name="shipping"
                            id="ship-1"
                            value="free"
                          />
                          <label htmlFor="ship-1">Free</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4>Next day delivery </h4>
                    </div>
                    <div className="col-6">
                      <div className="cf-radio-btns">
                        <div className="cfr-item">
                          <input
                            required
                            type="radio"
                            name="shipping"
                            id="ship-2"
                            value="3.45"
                          />
                          <label htmlFor="ship-2">$3.45</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="payment__method">Payment Method</div>
                  <div className="payment__type">
                    <input
                      required
                      type="radio"
                      name="p-method"
                      id="pay-method1"
                      value="Credit / Debit Card"
                    />
                    <label htmlFor="pay-method1">
                      Credit / Debit Card
                      <img
                        className="img-fluids ml-3"
                        src={mastercard}
                        alt="mastercard"
                      />
                    </label>
                  </div>
                  <div className="payment__type">
                    <input
                      required
                      type="radio"
                      name="p-method"
                      id="pay-method2"
                      value="Pay when you get the package"
                    />
                    <label htmlFor="pay-method2">
                      Pay when you get the package
                      <i className="fas fa-gift ml-3"></i>
                    </label>

                    {/* <i className="far fa-handshake"></i> */}
                  </div>
                  <div className="d-flex justify-content-between">
                    <NavLink to="/cart" className="back_cart__btn">
                      Back to Cart
                    </NavLink>
                    <button
                      //   onClick={() => handleCrumbSwitch(1)}
                      type="submit"
                      className="next__btn"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeCrumb === 1 && (
              <div className="col-md-12 mx-auto">
                <div className="row">
                  <div className="col-md-6 col-lg-6 order-md-first order-sm-last">
                    <h3 className="checkout_title">Pay with Card</h3>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        amount={cartTotal + deliveryType}
                        setPaymentCompleted={setPaymentCompleted}
                        orderInfo={orderInfo}
                      />
                    </Elements>
                  </div>
                  <div className="col-md-6 col-lg-6 order-md-last order-sm-first">
                    <h3 className="checkout_title">Your Cart</h3>
                    <hr className="thick_hr" />
                    {cartDataToRender.map((dress) => (
                      <div key={dress.id} className="row mb-4">
                        <div className="col">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="checkout__wrapper">
                              <img
                                src={`${backendUrl}${dress.main_image}`}
                                alt={dress.name}
                                className="img-fluid"
                              />
                            </div>
                            <p className="dress__name__quantity">
                              {dress.name} <span>- x{dress.quantity}</span>
                            </p>
                            <p className="dress__price">
                              ${dress.quantity * dress.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <hr className="thick_hr" />
                    <div className="d-flex gr-total">
                      <h5>Grand Total</h5>
                      <div className="ml-auto h5">${cartTotal}</div>
                    </div>
                    <hr className="thick_hr" />
                    <button
                      onClick={() => setActiveCrumb(0)}
                      className="back_address__btn w-100"
                    >
                      Change my address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
