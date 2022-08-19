// import React from 'react'
import { useContext, useEffect } from "react";
import dressContext from "../context/dressup-context";
import "./checkout.css";

const Checkout = () => {
  const handleCheckoutForm = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(data);
  };
  const { getCartItemFromStorage, backendUrl, calculateTotal } =
    useContext(dressContext);
  const data = getCartItemFromStorage();
  const cartTotal = calculateTotal(data);

  return (
    <div className="container">
      <h2 className="title__caption">Checkout</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={handleCheckoutForm} className="checkout__form">
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
                    <input required type="radio" name="shipping" id="ship-1" />
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
                    <input required type="radio" name="shipping" id="ship-2" />
                    <label htmlFor="ship-2">$3.45</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="payment__method">Payment Method</div>
            <button type="submit" className="order__now">
              Order Now
            </button>
          </form>
        </div>
        <div className="col-md-5">
          <hr className="thick_hr" />
          {data.map((dress) => (
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
