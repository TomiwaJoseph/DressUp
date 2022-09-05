import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import {
  deleteWishlistDress,
  fetchUserOrders,
  fetchWishlistDresses,
  logOutUser,
} from "../redux/actions/fetchers";
import "./dashboard.css";

const Dashboard = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const storeContext = useSelector((state) => state.dress);
  const {
    fetchingData,
    noInternet,
    isAuthenticated,
    userInfo,
    backendUrl,
    wishlistData,
    wishlistCount,
    userOrderHistory,
  } = storeContext;
  const { first_name, last_name, email } = userInfo;
  const [currentSection, setCurrentSection] = useState(0);

  let allOrders = [
    {
      id: 1,
      ref_no: "apq262yq5ml4s7ytlvcn",
      ordered_date: "3/09/2022",
      received: false,
    },
    {
      id: 2,
      ref_no: "k8i077x4dqpn9rof4fpw",
      ordered_date: "12/09/2022",
      received: true,
    },
  ];

  const handleLogoutClick = () => {
    logOutUser();
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  useEffect(() => {
    fetchWishlistDresses();
  }, [wishlistCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { previousPath: pathname } });
    }
  }, [isAuthenticated]);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <div className="container">
      <h2 className="title__caption">Dashboard</h2>
      <hr className="underline" />
      <div className="dashboard row">
        <div className="col-md-5">
          <div className="list-group" id="dashboard_sidebar">
            <button
              onClick={() => setCurrentSection(0)}
              className={`list-group-item btn btn-outline-info ${
                currentSection === 0 ? "active" : null
              }`}
              id="info_btn"
            >
              My Info
            </button>
            <button
              onClick={() => setCurrentSection(1)}
              className={`list-group-item btn btn-outline-info ${
                currentSection === 1 ? "active" : null
              }`}
              id="order_sidebar_btn"
            >
              Orders
            </button>
            <button
              onClick={() => setCurrentSection(2)}
              className={`list-group-item btn btn-outline-info ${
                currentSection === 2 ? "active" : null
              }`}
              id="wish_sidebar_btn"
            >
              Wishlist
            </button>
            <button onClick={handleLogoutClick} className="logout__btn">
              Logout
            </button>
          </div>
        </div>
        <div className="col-md-7">
          {currentSection === 0 && (
            <div className="info__container">
              <div className="user_information">
                <p>
                  Name:
                  <span className="text-muted"> {first_name}</span>
                </p>
                <p>
                  Name:
                  <span className="text-muted"> {last_name}</span>
                </p>
                <p>
                  Email:
                  <span className="text-muted"> {email}</span>
                </p>
              </div>
            </div>
          )}
          {currentSection === 1 && (
            <>
              <div className="order__container">
                {userOrderHistory.length ? (
                  <>
                    <h3>Order History</h3>
                    {userOrderHistory.map((order) => (
                      <div key={order.id} className="order__div">
                        <p>{order.start_date}</p>
                        <NavLink
                          to={`/user/track-order/${order.ref_code}`}
                          className={`order__tracker_btn ${
                            order.delivered ? "delivered" : "processing"
                          }`}
                        >
                          {order.ref_code}
                        </NavLink>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="empty__order_history">
                    <h3>You have no orders yet.</h3>
                  </div>
                )}
              </div>
            </>
          )}
          {currentSection === 2 && (
            <>
              <div className="wishlist_container">
                <div className="row">
                  {wishlistData.length ? (
                    <>
                      {wishlistData.map((dress) => (
                        <div key={dress.id} className="col-md-4">
                          <div className="wishlist__img_container">
                            <NavLink to={`/shop/dress/${dress.slug}`}>
                              <img
                                className="img-fluid"
                                src={`${backendUrl}${dress.main_image}`}
                                alt={dress.slug}
                              />
                            </NavLink>
                          </div>
                          <button
                            className="delete__wishlist_btn"
                            onClick={() => {
                              deleteWishlistDress(dress.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="empty__wishlist">
                      <h3>No dress in your wishlist.</h3>
                    </div>
                  )}
                  {/* <div className="col-md-4 bg-warning">text</div>
                  <div className="col-md-4 bg-secondary">text</div> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
