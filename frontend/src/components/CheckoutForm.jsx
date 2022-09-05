// import { useEffect, useState } from "react";
// import {
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
// } from "@stripe/react-stripe-js";
// import { stripePaymentMethodHandler } from "../stripe-script";
// import "./checkoutform.css";
// import { NavLink } from "react-router-dom";

// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       //   lineHeight: "27px",
//       color: "#212529",
//       fontSize: "16px",
//       "::placeholder": {
//         color: "#aab7c4",
//       },
//     },
//     invalid: {
//       color: "#fa755a",
//       iconColor: "#fa755a",
//     },
//   },
// };

// const CheckoutForm = (props) => {
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   //   useEffect(() => {
//   //     props.setPaymentCompleted(true);
//   //     console.log("pyscho...");
//   //   }, []);

//   const stripe = useStripe();
//   const elements = useElements();
//   const successMessage = () => {
//     return (
//       <div className="success-msg">
//         <svg
//           width="1em"
//           height="1em"
//           viewBox="0 0 16 16"
//           className="bi bi-check2"
//           fill="currentColor"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill-rule="evenodd"
//             d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
//           />
//         </svg>
//         <div className="title">Payment Successful</div>
//         <NavLink to="/user/dashboard">Track order</NavLink>
//       </div>
//     );
//   };
//   const handlePaymentFormSubmit = async (event) => {
//     // We don't want to let default form submission happen here,
//     // which would refresh the page.
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     setLoading(true);
//     setErrorMsg("");

//     const paymentMethodObj = {
//       type: "card",
//       card: elements.getElement(CardNumberElement),
//       billing_details: {
//         name,
//         email,
//       },
//     };
//     const paymentMethodResult = await stripe.createPaymentMethod(
//       paymentMethodObj
//     );
//     // console.log(paymentMethodResult);

//     stripePaymentMethodHandler(
//       {
//         result: paymentMethodResult,
//         amount: props.amount,
//       },
//       handleResponse
//     );
//   };
//   // callback method to handle the response
//   const handleResponse = (response) => {
//     setLoading(false);
//     if (response.error) {
//       setErrorMsg(
//         typeof response.error === "string"
//           ? response.error
//           : response.error.message
//       );
//       return;
//     }
//     props.setPaymentCompleted(response.message === "Success" ? true : false);
//   };

//   return (
//     <>
//       <form onSubmit={handlePaymentFormSubmit} className="stripe-form">
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label htmlFor="cc-name">Name on card</label>
//             <input
//               id="cc-name"
//               type="text"
//               className="form-control"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label htmlFor="cc-email">Email</label>
//             <input
//               id="cc-email"
//               type="text"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-12 mb-3">
//             <label htmlFor="cc-number">Card Number</label>
//             <CardNumberElement
//               id="cc-number"
//               className="form-control"
//               options={CARD_ELEMENT_OPTIONS}
//             />
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label htmlFor="expiry">Expiration Date</label>
//             <CardExpiryElement
//               id="expiry"
//               className="form-control"
//               options={CARD_ELEMENT_OPTIONS}
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label htmlFor="cvc">CVC</label>
//             <CardCvcElement
//               id="cvc"
//               className="form-control"
//               options={CARD_ELEMENT_OPTIONS}
//             />
//           </div>
//         </div>

//         <hr className="mb-4" />
//         <button className="btn btn-dark w-100" type="submit" disabled={loading}>
//           {loading ? (
//             <div className="spinner-border text-light" role="status">
//               <span className="sr-only">Loading...</span>
//             </div>
//           ) : (
//             `Pay $${props.amount}.00`
//           )}
//         </button>
//         {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
//       </form>
//     </>
//   );
// };

// export default CheckoutForm;
