import { useEffect, useReducer } from "react";
import {
  CLEAN_CART,
  GET_ALL_CATEGORIES,
  GET_CURRENT_CATEGORY,
  GET_HIGHEST_PRICE,
  GET_HOTTEST_DRESSES,
  GET_RELATED_DRESS,
  GET_SINGLE_DRESS,
  IS_FETCHING_DATA,
  LOGIN_USER,
  LOGOUT_USER,
  NO_INTERNET,
  SET_BAD_URL,
  SET_CART_COUNT,
  SET_CART_DATA,
} from "./dress-actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DressContext from "./dress-context";
import dressReducer from "./dress-reducer";
import { useNavigate } from "react-router-dom";

const DressState = (props) => {
  const initialState = {
    hotDressesData: [],
    allCategoriesData: [],
    currentCategoryData: [],
    cartDataToRender: [],
    categoryDresses: [],
    singleDressData: [],
    relatedDressData: [],
    badUrl: false,
    serverError: false,
    noInternet: false,
    fetchingData: false,
    isAuthenticated: false,
    cartCount: 0,
    highestDressPrice: 0,
    backendUrl: "http://localhost:8000",
    userLoginUrl: "http://localhost:8000/api/auth/login/",
    userLogoutUrl: "http://localhost:8000/api/auth/logout/",
    highestDressPriceUrl: "http://localhost:8000/api/get-highest-price/",
    allCategoriesUrl: "http://localhost:8000/api/get-all-categories/",
    currentCategoryUrl:
      "http://localhost:8000/api/get-all-dresses-or-category/",
    filterCategoryUrl: "http://localhost:8000/api/filter-category-price/",
    singleDressUrl: "http://localhost:8000/api/dress/",
    userCreateUrl: "http://localhost:8000/api/auth/register/",
    relatedDressUrl: "http://localhost:8000/api/dress/related/",
    hotDressesUrl: "http://localhost:8000/api/get-hottest-dresses/",
  };

  const [state, dispatch] = useReducer(dressReducer, initialState);
  const navigate = useNavigate();
  const notify = (message, errorType) =>
    toast(message, {
      position: "top-center",
      autoClose: "3000",
      pauseOnHover: true,
      closeOnClick: true,
      type: errorType,
      theme: "colored",
    });

  useEffect(() => {
    dispatch({ type: LOGIN_USER, payload: props.isAuth });
    getCartItemCountFromStorage();
    // console.log(initialState.isAuthenticated);
  }, [props.isAuth]);
  // Add dress to cart in localStorage
  const addToCart = (id, name, price, quantity, main_image) => {
    let newDress = {
      id: id,
      name: name,
      quantity: quantity,
      price: price,
      main_image: main_image,
    };
    let cartItems = localStorage.getItem("cart");
    if (cartItems) {
      let cart = JSON.parse(cartItems);
      const isDressPresent = cart.find((obj) => obj.id === id);
      if (isDressPresent) {
        let newCart = cart.map((dress) =>
          dress.id === isDressPresent.id
            ? { ...dress, quantity: quantity }
            : dress
        );
        localStorage.setItem("cart", JSON.stringify(newCart));
      } else {
        cart.push(newDress);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      let cart = [];
      cart.push(newDress);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    getCartItemCountFromStorage();
  };
  // Calculate the total for items in cart
  const calculateTotal = (cartData) => {
    let allQuantities = cartData.map((item) => item.quantity);
    let getPrices = cartData.map((item) => item.price);
    let multiply = getPrices
      .map((price, index) => price * allQuantities[index])
      .reduce(function (x, y) {
        return x + y;
      }, 0);
    return multiply;
  };
  // Set the value of amount of dresses in cart
  const setCartCount = (value) => {
    if (value === "clean up") {
      dispatch({ type: CLEAN_CART, payload: value });
    } else {
      dispatch({ type: SET_CART_COUNT, payload: value });
    }
  };
  //   Get the count of how many items are in localstorage cart
  const getCartItemCountFromStorage = () => {
    let cartItems = localStorage.getItem("cart");
    let theCount = 0;
    if (cartItems) {
      theCount = JSON.parse(cartItems).length;
    }
    setCartCount(theCount);
  };
  // Remove dress from cart in localStorage
  const removeCartItem = (id) => {
    let tempCart = JSON.parse(localStorage.getItem("cart"));
    let newCart = tempCart.filter((obj) => obj.id !== id);
    dispatch({ type: SET_CART_DATA, payload: newCart });
    localStorage.setItem("cart", JSON.stringify(newCart));
    getCartItemCountFromStorage();
  };
  const getCartItemFromStorage = () => {
    let cartItems = localStorage.getItem("cart");
    let cartData = [];
    if (cartItems) {
      cartData = JSON.parse(cartItems);
    }
    return cartData;
  };
  // Get the hottest dresses the shop has from api
  const getHottestDresses = () => {
    switchPreloader(true);
    fetch(state.hotDressesUrl)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_HOTTEST_DRESSES,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        interErrorSwitch();
      });
  };
  // Get single dress details from api
  const getSingleDress = (category) => {
    switchPreloader(true);
    fetch(state.singleDressUrl + category)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_SINGLE_DRESS,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        if (err.toString() === "TypeError: Failed to fetch") {
          interErrorSwitch();
        } else {
          dispatch({ type: SET_BAD_URL, payload: true });
        }
      });
  };
  // Get related dresses to the dress being viewed from api
  const getRelatedDress = (category) => {
    fetch(state.relatedDressUrl + category)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        dispatch({
          type: GET_RELATED_DRESS,
          payload: data,
        });
      })
      .catch((err) => {
        interErrorSwitch();
      });
  };
  // Get the highest price the shop has from api
  const getHighestPrice = () => {
    switchPreloader(true);
    fetch(state.highestDressPriceUrl)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_HIGHEST_PRICE,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        interErrorSwitch();
      });
  };
  //   Turn preloader on or off
  const switchPreloader = (status) => {
    dispatch({
      type: IS_FETCHING_DATA,
      payload: status,
    });
  };
  //   Show internet error
  const interErrorSwitch = () => {
    dispatch({
      type: NO_INTERNET,
      payload: true,
    });
  };
  // Get all dresses in the category user chose
  const getCurrentCategory = (category) => {
    switchPreloader(true);
    fetch(state.currentCategoryUrl + category)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_CURRENT_CATEGORY,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        interErrorSwitch();
      });
  };
  // Get all dresses categories from api
  const getAllCategories = () => {
    switchPreloader(true);
    fetch(state.allCategoriesUrl)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_ALL_CATEGORIES,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        interErrorSwitch();
      });
  };
  // Get dresses based on filter
  const getFilteredDresses = (filter_values) => {
    switchPreloader(true);
    let minValue = filter_values[0];
    let maxValue = filter_values[1];
    let filteredCatetories = [];
    if (filter_values.includes("All Dresses")) {
      filteredCatetories.push("All Dresses");
    } else {
      filteredCatetories = filter_values.slice(2);
    }
    fetch(state.filterCategoryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minValue: minValue,
        maxValue: maxValue,
        categories: filteredCatetories,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        switchPreloader(false);
        dispatch({
          type: GET_CURRENT_CATEGORY,
          payload: data,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        interErrorSwitch();
      });
  };
  // Sign up users with the credentials that are provided
  const signUpUser = (signUpData) => {
    switchPreloader(true);
    fetch(state.userCreateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: signUpData[0],
        last_name: signUpData[1],
        email: signUpData[2],
        password: signUpData[3],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        switchPreloader(false);
        navigate("/login");
        notify("Account successfully created! You can login now.", "success");
        // dispatch({
        //   type: SIGNUP_USER,
        //   payload: data,
        // });
      })
      .catch((err) => {
        switchPreloader(false);
        if (err.toString() === "TypeError: Failed to fetch") {
          interErrorSwitch();
        } else {
          notify("You already have an account with us! Please login.", "info");
        }
        localStorage.removeItem("token");
      });
  };
  // Sign in user with token if correct credentials are provided
  const signInUser = (signInData) => {
    switchPreloader(true);
    fetch(state.userLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInData[0],
        password: signInData[1],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        switchPreloader(false);
        navigate("/cart");
        notify("Successful login! Enjoy your shopping.", "success");
        localStorage.setItem("token", data.token);
        dispatch({
          type: LOGIN_USER,
          payload: true,
        });
      })
      .catch((err) => {
        switchPreloader(false);
        if (err.toString() === "TypeError: Failed to fetch") {
          interErrorSwitch();
        } else {
          notify("Incorrect email or password! Try again.", "error");
        }
        localStorage.removeItem("token");
      });
  };
  // Log out the user with token
  const logOutUser = () => {
    let token = localStorage.getItem("token");
    fetch(state.userLogoutUrl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        localStorage.removeItem("token");
        navigate("/");
        notify("Logout successful!", "info");
        dispatch({
          type: LOGOUT_USER,
          payload: false,
        });
      })
      .catch((err) => {
        if (err.toString() === "TypeError: Failed to fetch") {
          interErrorSwitch();
        } else {
          notify("Unable to log out! Try again.", "error");
        }
      });
  };

  return (
    <DressContext.Provider
      value={{
        categoryDresses: state.categoryDresses,
        currentCategoryData: state.currentCategoryData,
        noInternet: state.noInternet,
        serverError: state.serverError,
        fetchingData: state.fetchingData,
        cartCount: state.cartCount,
        isAuthenticated: state.isAuthenticated,
        highestDressPrice: state.highestDressPrice,
        allCategoriesData: state.allCategoriesData,
        backendUrl: state.backendUrl,
        hotDressesData: state.hotDressesData,
        cartDataToRender: state.cartDataToRender,
        singleDressData: state.singleDressData,
        relatedDressData: state.relatedDressData,
        badUrl: state.badUrl,
        addToCart,
        getAllCategories,
        getCurrentCategory,
        signInUser,
        logOutUser,
        getCartItemCountFromStorage,
        getCartItemFromStorage,
        getHighestPrice,
        getFilteredDresses,
        getHottestDresses,
        removeCartItem,
        calculateTotal,
        setCartCount,
        getSingleDress,
        getRelatedDress,
        signUpUser,
      }}
    >
      <ToastContainer />
      {props.children}
    </DressContext.Provider>
  );
};

export default DressState;
