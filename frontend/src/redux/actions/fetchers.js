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

const userLoginUrl = "https://dress.up.railway.app/api/auth/login/";
const userLogoutUrl = "https://dress.up.railway.app/api/auth/logout/";
const highestDressPriceUrl =
  "https://dress.up.railway.app/api/get-highest-price/";
const allCategoriesUrl = "https://dress.up.railway.app/api/get-all-categories/";
const currentCategoryUrl =
  "https://dress.up.railway.app/api/get-all-dresses-or-category/";
const filterCategoryUrl =
  "https://dress.up.railway.app/api/filter-category-price/";
const singleDressUrl = "https://dress.up.railway.app/api/dress/";
const userRegisterUrl = "https://dress.up.railway.app/api/auth/register/";
const relatedDressUrl = "https://dress.up.railway.app/api/dress/related/";
const hotDressesUrl = "https://dress.up.railway.app/api/get-hottest-dresses/";
const sendOrderDetailsUrl =
  "https://dress.up.railway.app/api/save-paylater-details/";
const addToCartUrl = "https://dress.up.railway.app/api/add-to-cart/";
const addToWishlistUrl = "https://dress.up.railway.app/api/add-to-wishlist/";
const cartContentUrl = "https://dress.up.railway.app/api/get-cart-content/";
const removeCartItemUrl = "https://dress.up.railway.app/api/remove-cart-item/";
const cleanCartUrl = "https://dress.up.railway.app/api/remove-cart/";
const changeCartContentUrl =
  "https://dress.up.railway.app/api/change-cart-item/";
const cartCountUrl = "https://dress.up.railway.app/api/get-cart-count/";
const fetchWishlistDressesUrl =
  "https://dress.up.railway.app/api/fetch-wishlist-dresses/";
const deleteWishlistDressUrl =
  "https://dress.up.railway.app/api/delete-wishlist-dress/";
const fetchUserOrdersUrl = "https://dress.up.railway.app/api/get-user-orders/";
const fetchOrderDetailsUrl =
  "https://dress.up.railway.app/api/get-specific-order/";
const requestRefundUrl = "https://dress.up.railway.app/api/request-refund/";
const demoUserUrl = "https://dress.up.railway.app/api/login-demo-user/";
const addToNewsletterUrl =
  "https://dress.up.railway.app/api/add-to-newsletter/";
const searchDressByNameUrl = "https://dress.up.railway.app/api/search-dress/";

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
  await axios
    .post(changeCartContentUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      setCartTotal(result.data.new_cart);
    })
    .catch((err) => {
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
  await axios
    .post(addToCartUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      setCartCount(result.data.cart_count);
      notify("Dress added to cart successfully!", "info");
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
};
// Remove cart from session in server
export const removeCart = async () => {
  switchPreloader(true);
  await axios
    .get(cleanCartUrl)
    .then((response) => {
      store.dispatch(setCleanCart());
      switchPreloader(false);
    })
    .catch((err) => {
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get all cart content from api
export const fetchCartContent = async () => {
  switchPreloader(true);
  await axios
    .get(cartContentUrl)
    .then((response) => {
      store.dispatch(setCartData(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
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
  await axios
    .post(addToWishlistUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      notify("Dress added to wishlist successfully!", "info");
    })
    .catch((err) => {
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
  await axios
    .get(cartCountUrl)
    .then((response) => {
      setCartCount(response.data);
      switchPreloader(false);
    })
    .catch((err) => {
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Remove dress from cart in localStorage
export const removeCartItem = async (id) => {
  let body = JSON.stringify({
    dressId: id,
  });
  await axios
    .post(removeCartItemUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      setCartCount(result.data.cart_count);
      notify("Dress removed from cart!", "info");
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
    });
};
// Turn preloader on or off
export const switchPreloader = (status) => {
  store.dispatch(setPreloaderStatus(status));
};
// Get all dresses in the category user chose
export const fetchCurrentCategory = async (category) => {
  if (category) {
    switchPreloader(true);
    await axios
      .get(currentCategoryUrl + category)
      .then((response) => {
        store.dispatch(setCurrentCategory(response.data));
        switchPreloader(false);
      })
      .catch((err) => {
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
  await axios
    .get(allCategoriesUrl)
    .then((response) => {
      store.dispatch(setAllCategory(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get all dresses categories from api
export const fetchSingleDress = async (category) => {
  switchPreloader(true);
  await axios
    .get(singleDressUrl + category)
    .then((response) => {
      store.dispatch(setSingleDress(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
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
  await axios
    .get(relatedDressUrl + category)
    .then((response) => {
      store.dispatch(setRelatedDress(response.data));
    })
    .catch((err) => {
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
  await axios
    .get(hotDressesUrl)
    .then((response) => {
      store.dispatch(setHottestDresses(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
      store.dispatch(setInternetError(true));
      switchPreloader(false);
    });
};
// Get the highest price the shop has from api
export const fetchHighestPrice = async () => {
  switchPreloader(true);
  await axios
    .get(highestDressPriceUrl)
    .then((response) => {
      store.dispatch(setHighestPrice(response.data));
      switchPreloader(false);
    })
    .catch((err) => {
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
  await axios
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
  await axios
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
  await axios
    .post(userRegisterUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      document.getElementById("login").click();
      notify("Account created successfully! You can login now.", "success");
    })
    .catch((err) => {
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
  await axios
    .get(userLogoutUrl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((result) => {
      store.dispatch(setLogoutUser(false));
      localStorage.removeItem("token");
      document.getElementById("home").click();
      notify("Logout successful!", "info");
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Unable to log out! Try again.", "error");
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
  await axios
    .post(sendOrderDetailsUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      store.dispatch(setPaylaterStatus(true));
      removeCart();
    })
    .catch((err) => {
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
  await axios
    .post(fetchWishlistDressesUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      store.dispatch(setWishlistData(result.data));
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
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
  await axios
    .post(fetchUserOrdersUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      store.dispatch(setUserOrderHistory(result.data.user_orders));
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
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
  await axios
    .post(fetchOrderDetailsUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      store.dispatch(setUserOrderDressesData(result.data.order_item_data));
      store.dispatch(setUserOrderDetails(result.data.order_details));
    })
    .catch((err) => {
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
  await axios
    .post(deleteWishlistDressUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      store.dispatch(setWishlistCount(result.data.wishlist_count));
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
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
  await axios
    .post(requestRefundUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      notify(
        "Your request has been received! Expect an email from us soon.",
        "info"
      );
    })
    .catch((err) => {
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
  await axios
    .post(addToNewsletterUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      notify(
        "You have been successfully added to our newsletter list.",
        "success"
      );
    })
    .catch((err) => {
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
  await axios
    .post(searchDressByNameUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      switchPreloader(false);
      store.dispatch(setSearchResult(result.data.data));
    })
    .catch((err) => {
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
  await axios
    .get(demoUserUrl)
    .then((result) => {
      store.dispatch(setUserInfo(result.data.user_info));
      notify("Successful login! Enjoy your shopping.", "success");
      localStorage.setItem("token", result.data.token);
      store.dispatch(setLoginUser(true));
      switchPreloader(false);
    })
    .catch((err) => {
      if (err.message === "Network Error") {
        store.dispatch(setInternetError(true));
      }
      notify("Something unexpected happened!", "error");
      switchPreloader(false);
    });
};
