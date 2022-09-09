const API_ENDPOINT = "http://localhost:8000/api";

export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, orderInfo, result } = data;
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      payment_method_id: result.paymentMethod.id,
      name: result.paymentMethod.billing_details.name,
      email: result.paymentMethod.billing_details.email,
      amount: amount,
      orderInfo: orderInfo,
      token: localStorage.getItem("token"),
    });
    cb(paymentResponse);
  }
};

// place backend API call for payment
const stripePayment = async (data) => {
  const res = await fetch(`${API_ENDPOINT}/save-stripe-info/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
