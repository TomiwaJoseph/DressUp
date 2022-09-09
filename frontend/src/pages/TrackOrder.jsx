import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Preloader from "../components/Preloader";
import { calculateTotal, fetchOrderDetails } from "../redux/actions/fetchers";
import ErrorPage from "./ErrorPage";
import "./trackorder.css";

const TrackOrder = () => {
  const storeContext = useSelector((state) => state.dress);
  const {
    fetchingData,
    noInternet,
    isAuthenticated,
    badRequest,
    backendUrl,
    userOrderDetailsData,
    userOrderDressesData,
  } = storeContext;
  const {
    ref_code,
    start_date,
    billing_address,
    alternative_billing_address,
    phone_number,
    delivered,
    delivery_type,
    being_processed,
    payment_method,
  } = userOrderDetailsData;
  const { orderId } = useParams();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  let cartTotal = calculateTotal(userOrderDressesData);

  useEffect(() => {
    fetchOrderDetails(orderId);
  }, [orderId]);

  if (badRequest) {
    return <ErrorPage />;
  }
  if (fetchingData) {
    return <Preloader />;
  }

  return (
    <div className="container track-order mt-5">
      {/* <h2>Order Detail</h2>
      <hr /> */}
      <h2>Order Detail</h2>
      <hr className="underline" />
      <div className="row mb-3">
        <div className="col-md-7 mb-3">
          <div className="order-status">
            <div className="processing">
              <i className="fas fa-check"></i>
              <p>Processing</p>
            </div>
            <div className={delivered ? "delivered true" : "delivered"}>
              <i className={delivered ? "fas fa-check" : "fas fa-times"}></i>
              <p>Delivered</p>
            </div>
          </div>
          <div className="order-details">
            <p>
              Order Date:
              <span className="text-muted"> {start_date}</span>
            </p>
            <p>
              Ref Code:
              <span className="text-muted"> {ref_code}</span>
            </p>
            <p>
              Billing Address:
              <span className="text-muted"> {billing_address}</span>
            </p>
            {alternative_billing_address && (
              <p>
                Alternative billing address:
                <span className="text-muted">
                  {" "}
                  {alternative_billing_address}
                </span>
              </p>
            )}
            <p>
              Phone Number:
              <span className="text-muted"> {phone_number}</span>
            </p>
            <p>
              Delivery Type:
              <span className="text-muted">
                {" "}
                {delivery_type === "SD"
                  ? "Standard Delivery"
                  : "Next Day Delivery"}
              </span>
            </p>
            <p>
              Payment Method:
              <span className="text-muted">
                {" "}
                {payment_method === "PL" ? "Pay Later" : "Credit / Debit Card"}
              </span>
            </p>
          </div>
          {delivered && (
            <button
              onClick={() => navigate("/order/refund")}
              className="btn request-refund"
            >
              Request Refund
            </button>
          )}
        </div>
        <div className="col-md-5">
          {/* {userOrderDetailsData.map((order) => (
            ))} */}
          <h3 className="checkout_title">Your Cart</h3>
          <hr className="thick_hr" />
          {userOrderDressesData.map((dress) => (
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

export default TrackOrder;
