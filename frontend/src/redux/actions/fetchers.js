import axios from "axios";
import store from "../store/store";
import {
  setAllCategory,
  setBadRequest,
  setCartCountAction,
  setCartData,
  setCartTotalAction,
  setCleanCart,
  setCurrentCategory,
  setHighestPrice,
  setHottestDresses,
  setInternetError,
  setLoginUser,
  setLogoutUser,
  setPaylaterStatus,
  setPreloaderStatus,
  setRelatedDress,
  setSearchResult,
  setSingleDress,
  setUserInfo,
  setUserOrderDetails,
  setUserOrderDressesData,
  setUserOrderHistory,
  setWishlistCount,
  setWishlistData,
} from "./dressActions";
import { toast } from "react-toastify";

const userLoginUrl = "http://localhost:8000/api/auth/login/";
const userLogoutUrl = "http://localhost:8000/api/auth/logout/";
const highestDressPriceUrl = "http://localhost:8000/api/get-highest-price/";
const allCategoriesUrl = "http://localhost:8000/api/get-all-categories/";
const currentCategoryUrl =
  "http://localhost:8000/api/get-all-dresses-or-category/";
const filterCategoryUrl = "http://localhost:8000/api/filter-category-price/";
const singleDressUrl = "http://localhost:8000/api/dress/";
const userRegisterUrl = "http://localhost:8000/api/auth/register/";
const relatedDressUrl = "http://localhost:8000/api/dress/related/";
const hotDressesUrl = "http://localhost:8000/api/get-hottest-dresses/";
const sendOrderDetailsUrl = "http://localhost:8000/api/save-paylater-details/";
const addToCartUrl = "http://localhost:8000/api/add-to-cart/";
const addToWishlistUrl = "http://localhost:8000/api/add-to-wishlist/";
const cartContentUrl = "http://localhost:8000/api/get-cart-content/";
const removeCartItemUrl = "http://localhost:8000/api/remove-cart-item/";
const cleanCartUrl = "http://localhost:8000/api/remove-cart/";
const changeCartContentUrl = "http://localhost:8000/api/change-cart-item/";
const cartCountUrl = "http://localhost:8000/api/get-cart-count/";
const fetchWishlistDressesUrl =
  "http://localhost:8000/api/fetch-wishlist-dresses/";
const deleteWishlistDressUrl =
  "http://localhost:8000/api/delete-wishlist-dress/";
const fetchUserOrdersUrl = "http://localhost:8000/api/get-user-orders/";
const fetchOrderDetailsUrl = "http://localhost:8000/api/get-specific-order/";
const requestRefundUrl = "http://localhost:8000/api/request-refund/";
const demoUserUrl = "http://localhost:8000/api/login-demo-user/";
const addToNewsletterUrl = "http://localhost:8000/api/add-to-newsletter/";
const searchDressByNameUrl = "http://localhost:8000/api/search-dress/";

const notify = (message, errorType) =>
  toast(message, {
    position: "top-center",
    autoClose: "3000",
    pauseOnHover: true,
    closeOnClick: true,
    type: errorType,
    theme: "colored",
  });

// change dress quantity in session storage in server
export const changeDressQuantity = async (id, quantity, action) => {
  let body = JSON.stringify({
    dressId: id,
    quantity: quantity,
    action: action,
  });
  const response = await axios
    .post(changeCartContentUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      setCartTotal(result.data.new_cart);
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
};
// Calculate total of cart data
export const calculateTotal = (data) => {
  let allQuantities = data.map((item) => item.quantity);
  let getPrices = data.map((item) => item.price);
  let grandTotal = getPrices
    .map((price, index) => price * allQuantities[index])
    .reduce(function (x, y) {
      return x + y;
    }, 0);
  return grandTotal;
};
// Set cart total based on cart items and quantity
export const setCartTotal = (data) => {
  let allQuantities = data.map((item) => item.quantity);
  let getPrices = data.map((item) => item.price);
  let grandTotal = getPrices
    .map((price, index) => price * allQuantities[index])
    .reduce(function (x, y) {
      return x + y;
    }, 0);
  store.dispatch(setCartTotalAction(grandTotal));
};
// Add dress to cart in session storage in server
export const addToCart = async (id, quantity) => {
  let body = JSON.stringify({
    dressId: id,
    quantity: quantity,
  });
  const response = await axios
    .post(addToCartUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      setCartCount(result.data.cart_count);
      notify("Dress added to cart successfully!", "info");
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
};
// Remove cart from session in server
export const removeCart = async () => {
  switchPreloader(true);
  const response = await axios
    .get(cleanCartUrl)
    .then((response) => {
      // console.log(response);
      store.dispatch(setCleanCart());
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get all cart content from api
export const fetchCartContent = async () => {
  switchPreloader(true);
  const response = await axios
    .get(cartContentUrl)
    .then((response) => {
      store.dispatch(setCartData(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Add dress to wishlist in server
export const addToWishlist = async (dressId) => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
    dressId: dressId,
  });
  const response = await axios
    .post(addToWishlistUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result);
      notify("Dress added to wishlist successfully!", "info");
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
};
// Set the value of amount of dresses in cart
export const setCartCount = (value) => {
  store.dispatch(setCartCountAction(value));
};
// Get the cart count from api
export const fetchCartCount = async () => {
  switchPreloader(true);
  const response = await axios
    .get(cartCountUrl)
    .then((response) => {
      // console.log(response);
      setCartCount(response.data);
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Remove dress from cart in localStorage
export const removeCartItem = async (id) => {
  // console.log(id);
  let body = JSON.stringify({
    dressId: id,
  });
  const response = await axios
    .post(removeCartItemUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      setCartCount(result.data.cart_count);
      notify("Dress removed from cart!", "info");
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
  // getCartItemCountFromStorage();
};
// Turn preloader on or off
export const switchPreloader = (status) => {
  store.dispatch(setPreloaderStatus(status));
};
// Get all dresses in the category user chose
export const fetchCurrentCategory = async (category) => {
  // console.log(category);
  if (category) {
    switchPreloader(true);
    const response = await axios
      .get(currentCategoryUrl + category)
      .then((response) => {
        // console.log(response.data);
        store.dispatch(setCurrentCategory(response.data));
        switchPreloader(false);
      })
      .catch((err) => {
        // console.log(err);
        if (err.message === "Network Error") {
          store.dispatch(setInternetError(true));
        }
        notify("Something unexpected happened!", "error");
        switchPreloader(false);
      });
  }
};
// Get all dresses categories from api
export const fetchAllCategory = async () => {
  switchPreloader(true);
  const response = await axios
    .get(allCategoriesUrl)
    .then((response) => {
      // console.log(response.data);
      store.dispatch(setAllCategory(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get all dresses categories from api
export const fetchSingleDress = async (category) => {
  // store.dispatch(setBadRequest(false));
  switchPreloader(true);
  const response = await axios
    .get(singleDressUrl + category)
    .then((response) => {
      // console.log(response.data);
      store.dispatch(setSingleDress(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      } else {
        store.dispatch(setBadRequest(true));
      }
      switchPreloader(false);
    });
};
// Get related dresses to the dress being viewed from api
export const fetchRelatedDress = async (category) => {
  // store.dispatch(setBadRequest(false));
  const response = await axios
    .get(relatedDressUrl + category)
    .then((response) => {
      // console.log(response.data);
      store.dispatch(setRelatedDress(response.data));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      } else {
        store.dispatch(setBadRequest(true));
      }
    });
};
// Get the hottest dresses the shop has from api
export const fetchHottestDresses = async () => {
  switchPreloader(true);
  const response = await axios
    .get(hotDressesUrl)
    .then((response) => {
      store.dispatch(setHottestDresses(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get the highest price the shop has from api
export const fetchHighestPrice = async () => {
  switchPreloader(true);
  const response = await axios
    .get(highestDressPriceUrl)
    .then((response) => {
      store.dispatch(setHighestPrice(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get dresses based on filter
export const fetchFilteredDresses = async (filter_values) => {
  switchPreloader(true);
  let minValue = filter_values[0];
  let maxValue = filter_values[1];
  let filteredCatetories = [];
  if (filter_values.includes("All Dresses")) {
    filteredCatetories.push("All Dresses");
  } else {
    filteredCatetories = filter_values.slice(2);
  }
  let body = JSON.stringify({
    minValue: minValue,
    maxValue: maxValue,
    categories: filteredCatetories,
  });
  const response = await axios
    .post(filterCategoryUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      store.dispatch(setCurrentCategory(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Sign in user with token if correct credentials are provided
export const signInUser = async (signInData) => {
  switchPreloader(true);
  let body = JSON.stringify({
    email: signInData[0],
    password: signInData[1],
  });
  const response = await axios
    .post(userLoginUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      store.dispatch(setUserInfo(result.data.user_info));
      notify("Successful login! Enjoy your shopping.", "success");
      localStorage.setItem("token", result.data.token);
      store.dispatch(setLoginUser(true));
      if (signInData[2]) {
        addToWishlist(signInData[2]);
      }
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Incorrect email or password! Try again.", "error");
      switchPreloader(false);
      localStorage.removeItem("token");
    });
};
// Sign up users with the credentials that are provided
export const signUpUser = async (signUpData) => {
  switchPreloader(true);
  let body = JSON.stringify({
    first_name: signUpData[0],
    last_name: signUpData[1],
    email: signUpData[2],
    password: signUpData[3],
  });
  const response = await axios
    .post(userRegisterUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(response);
      switchPreloader(false);
      document.getElementById("login").click();
      notify("Account created successfully! You can login now.", "success");
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("You already have an account with us! Please login.", "info");
      switchPreloader(false);
      localStorage.removeItem("token");
    });
};
// Log out the user with token
export const logOutUser = async () => {
  let token = localStorage.getItem("token");
  // switchPreloader(true);
  const response = await axios
    .get(userLogoutUrl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((result) => {
      // console.log(response);
      // switchPreloader(false);
      store.dispatch(setLogoutUser(false));
      localStorage.removeItem("token");
      document.getElementById("home").click();
      notify("Logout successful!", "info");
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Unable to log out! Try again.", "error");
      // switchPreloader(false);
      // localStorage.removeItem("token");
    });
};
// Send order details to server
export const savePaylaterDetails = async (orderDetails) => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
    address: orderDetails[0],
    optionalAddress: orderDetails[1],
    phoneNumber: orderDetails[2],
    deliveryInfo: orderDetails[3],
  });
  switchPreloader(true);
  const response = await axios
    .post(sendOrderDetailsUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result);
      switchPreloader(false);
      store.dispatch(setPaylaterStatus(true));
      removeCart();
      // store.dispatch(setCleanCart());
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify(
        "Something wierd happened! Some dresses you chose are no longer available in store.",
        "error"
      );
      switchPreloader(false);
    });
};
// Fetch all user's wishlist dresses from server
export const fetchWishlistDresses = async () => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
  });
  switchPreloader(true);
  const response = await axios
    .post(fetchWishlistDressesUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result);
      switchPreloader(false);
      store.dispatch(setWishlistData(result.data));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Fetch all user's orders from server
export const fetchUserOrders = async () => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
  });
  switchPreloader(true);
  const response = await axios
    .post(fetchUserOrdersUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      switchPreloader(false);
      store.dispatch(setUserOrderHistory(result.data.user_orders));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Fetch details of selected order from server
export const fetchOrderDetails = async (refCode) => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
    ref_code: refCode,
  });
  switchPreloader(true);
  const response = await axios
    .post(fetchOrderDetailsUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result);
      switchPreloader(false);
      store.dispatch(setUserOrderDressesData(result.data.order_item_data));
      store.dispatch(setUserOrderDetails(result.data.order_details));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Delete wishlist item from server
export const deleteWishlistDress = async (id) => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
    id: id,
  });
  // switchPreloader(true);
  const response = await axios
    .post(deleteWishlistDressUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result);
      // switchPreloader(false);
      store.dispatch(setWishlistCount(result.data.wishlist_count));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      // switchPreloader(false);
    });
};
// Request for refund on order
export const requestRefund = async (refundData) => {
  let token = localStorage.getItem("token");
  let body = JSON.stringify({
    token: token,
    refCode: refundData[0],
    reason: refundData[1],
  });
  switchPreloader(true);
  const response = await axios
    .post(requestRefundUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      switchPreloader(false);
      notify(
        "Your request has been received! Expect an email from us soon.",
        "info"
      );
      // store.dispatch(setWishlistCount(result.data.wishlist_count));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Add email to newsletter
export const addToNewsletter = async (email) => {
  if (email === "badEmail") {
    console.log("badEmail");
    return notify("Please enter a proper email", "info");
  }
  let body = JSON.stringify({
    email: email,
  });
  switchPreloader(true);
  const response = await axios
    .post(addToNewsletterUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data);
      switchPreloader(false);
      notify(
        "You have been successfully added to our newsletter list.",
        "success"
      );
      // store.dispatch(setWishlistCount(result.data.wishlist_count));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Search dress by name in server
export const searchDressByName = async (name) => {
  let body = JSON.stringify({
    name: name,
  });
  switchPreloader(true);
  const response = await axios
    .post(searchDressByNameUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      // console.log(result.data.data);
      switchPreloader(false);
      // notify(
      //   "You have been successfully added to our newsletter list.",
      //   "success"
      // );
      store.dispatch(setSearchResult(result.data.data));
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
// Login the demo user
export const loginDemoUser = async () => {
  switchPreloader(true);
  const response = await axios
    .get(demoUserUrl)
    .then((result) => {
      // console.log(result.data);
      store.dispatch(setUserInfo(result.data.user_info));
      notify("Successful login! Enjoy your shopping.", "success");
      localStorage.setItem("token", result.data.token);
      store.dispatch(setLoginUser(true));
      switchPreloader(false);
    })
    .catch((err) => {
      // console.log(err);
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
