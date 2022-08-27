import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { stripePaymentMethodHandler } from "../stripe-script";
import "./checkoutform.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      lineHeight: "27px",
      color: "#212529",
      fontSize: "1.1rem",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const handlePaymentFormSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // const { paymentMethod, error } = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(CardNumberElement),
    //   billing_details: {
    //     name,
    //     email,
    //   },
    // });
    // console.log(paymentMethod);
    // console.log(error);

    // if (error){
    //     setErrorMsg(error.response.data)
    // }else{
    //     ApiService.saveStripeInfo({

    //     })
    // }

    const paymentMethodObj = {
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
        email,
      },
    };
    const paymentMethodResult = await stripe.createPaymentMethod(
      paymentMethodObj
    );
    // console.log(paymentMethodResult);

    stripePaymentMethodHandler(
      {
        result: paymentMethodResult,
        amount: props.amount,
      },
      handleResponse
    );
  };
  // callback method to handle the response
  const handleResponse = (response) => {
    console.log("tonight, lets fall in love again...");
    console.log(response);
    setLoading(false);
    if (response.error) {
      setErrorMsg(
        typeof response.error === "string"
          ? response.error
          : response.error.message
      );
      return;
    }
    console.log("no errors");
    props.setPaymentCompleted(response.success ? true : false);
    console.log("payment is complete...");
  };

  return (
    <>
      <form onSubmit={handlePaymentFormSubmit} className="stripe-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-name">Name on card</label>
            <input
              id="cc-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="cc-email">Email</label>
            <input
              id="cc-email"
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="cc-number">Card Number</label>
            <CardNumberElement
              id="cc-number"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="expiry">Expiration Date</label>
            <CardExpiryElement
              id="expiry"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="cvc">CVC</label>
            <CardCvcElement
              id="cvc"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>

        <hr className="mb-4" />
        <button className="btn btn-dark w-100" type="submit" disabled={loading}>
          {loading ? (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            ></div>
          ) : (
            `Pay $${props.amount}.00`
          )}
        </button>
        {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
      </form>
    </>
  );
};

export default CheckoutForm;
