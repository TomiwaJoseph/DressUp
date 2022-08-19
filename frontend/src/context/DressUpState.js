import React, { useState } from "react";
import DressContext from "./dressup-context";

const DressUpState = (props) => {
  // GLOBAL VARIABLES
  const [cartCount, setCartCount] = useState(0);
  const [cartDataToRender, setCartDataToRender] = useState([]);

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

  const getCartItemFromStorage = () => {
    let cartItems = localStorage.getItem("cart");
    let cartData = [];
    if (cartItems) {
      cartData = JSON.parse(cartItems);
    }
    return cartData;
  };
  const removeCartItem = (id) => {
    let tempCart = JSON.parse(localStorage.getItem("cart"));
    let newCart = tempCart.filter((obj) => obj.id !== id);
    setCartDataToRender(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    getCartItemCountFromStorage();
  };

  const getCartItemCountFromStorage = () => {
    let cartItems = localStorage.getItem("cart");
    let theCount = 0;
    if (cartItems) {
      theCount = JSON.parse(cartItems).length;
    }
    setCartCount(theCount ? theCount : 0);
  };
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

  // FETCH REQUEST URLS
  const backendUrl = "http://localhost:8000";
  const singleDressUrl = "http://localhost:8000/api/dress/";
  const relatedDressUrl = "http://localhost:8000/api/dress/related/";
  const highestDressPriceUrl = "http://localhost:8000/api/get-highest-price/";
  const hotDressesUrl = "http://localhost:8000/api/get-hottest-dresses/";
  const allCategoriesUrl = "http://localhost:8000/api/get-all-categories/";
  const currentCategoryUrl =
    "http://localhost:8000/api/get-all-dresses-or-category/";
  const filterCategoryUrl = "http://localhost:8000/api/filter-category-price/";
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hotDressesData, setHotDressData] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [highestDressPrice, setHighestDressPrice] = useState(0);
  const [singleDressData, setSingleDressData] = useState([]);
  const [relatedDressData, setRelatedDressData] = useState([]);

  // FETCH REQUESTS FUNCTIONS
  const getHighestPrice = () => {
    setIsFetchingData(true);
    fetch(highestDressPriceUrl)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setHighestDressPrice(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getDressCategories = () => {
    setIsFetchingData(true);
    fetch(allCategoriesUrl)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setAllCategoriesData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getHottestDresses = () => {
    fetch(hotDressesUrl)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setHotDressData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getCurrentCategory = (category) => {
    setIsFetchingData(true);
    fetch(currentCategoryUrl + category)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setCurrentCategoryData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getSingleDress = (category) => {
    setIsFetchingData(true);
    fetch(singleDressUrl + category)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setSingleDressData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getRelatedDress = (category) => {
    setIsFetchingData(true);
    fetch(relatedDressUrl + category)
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setRelatedDressData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };
  const getFilteredDresses = (filter_values) => {
    setIsFetchingData(true);
    let minValue = filter_values[0];
    let maxValue = filter_values[1];
    let filteredCatetories = [];
    if (filter_values.includes("All Dresses")) {
      filteredCatetories.push("All Dresses");
    } else {
      filteredCatetories = filter_values.slice(2);
    }
    // console.log(minValue, maxValue, filteredCatetories);

    fetch(filterCategoryUrl, {
      method: "POST",
      body: JSON.stringify({
        minValue: minValue,
        maxValue: maxValue,
        categories: filteredCatetories,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw new Error(resp.statusText);
        }
      })
      .then((data) => {
        setCurrentCategoryData(data);
        setIsFetchingData(false);
        // console.log(data);
        // return data;
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingData(false);
        setIsError(true);
        // return error;
      });
  };

  return (
    <DressContext.Provider
      value={{
        getHighestPrice,
        getHottestDresses,
        getDressCategories,
        getCurrentCategory,
        getFilteredDresses,
        getSingleDress,
        getRelatedDress,
        addToCart,
        getCartItemCountFromStorage,
        getCartItemFromStorage,
        removeCartItem,
        setCartCount,
        calculateTotal,
        backendUrl,
        cartCount,
        highestDressPrice,
        isError,
        isFetchingData,
        hotDressesData,
        allCategoriesData,
        currentCategoryData,
        singleDressData,
        relatedDressData,
        cartDataToRender,
      }}
    >
      {props.children}
    </DressContext.Provider>
  );
};

export default DressUpState;
