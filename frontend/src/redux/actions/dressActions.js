import { ActionTypes } from "./action-types";

export const setCurrentCategory = (data) => {
  return {
    type: ActionTypes.GET_CURRENT_CATEGORY,
    payload: data,
  };
};
export const setAllCategory = (data) => {
  return {
    type: ActionTypes.GET_ALL_CATEGORIES,
    payload: data,
  };
};
export const setSearchResult = (data) => {
  return {
    type: ActionTypes.SET_SEARCH_RESULT,
    payload: data,
  };
};
export const setPreloaderStatus = (status) => {
  return {
    type: ActionTypes.IS_FETCHING_DATA,
    payload: status,
  };
};
export const setInternetError = (status) => {
  return {
    type: ActionTypes.NO_INTERNET,
    payload: status,
  };
};
export const setCartData = (value) => {
  return {
    type: ActionTypes.SET_CART_DATA,
    payload: value,
  };
};
export const setCartTotalAction = (value) => {
  return {
    type: ActionTypes.SET_CART_TOTAL,
    payload: value,
  };
};
export const setCleanCart = () => {
  return {
    type: ActionTypes.CLEAN_CART,
  };
};
export const setCartCountAction = (value) => {
  return {
    type: ActionTypes.SET_CART_COUNT,
    payload: value,
  };
};
export const setHighestPrice = (value) => {
  return {
    type: ActionTypes.GET_HIGHEST_PRICE,
    payload: value,
  };
};
export const setUserOrderHistory = (value) => {
  return {
    type: ActionTypes.SET_USER_ORDER_HISTORY,
    payload: value,
  };
};
export const setUserOrderDressesData = (value) => {
  return {
    type: ActionTypes.SET_USER_ORDER_ITEMS_DATA,
    payload: value,
  };
};
export const setUserOrderDetails = (value) => {
  return {
    type: ActionTypes.SET_USER_ORDER_DETAILS,
    payload: value,
  };
};
export const setSingleDress = (value) => {
  return {
    type: ActionTypes.GET_SINGLE_DRESS,
    payload: value,
  };
};
export const setRelatedDress = (value) => {
  return {
    type: ActionTypes.GET_RELATED_DRESS,
    payload: value,
  };
};
export const setPaylaterStatus = (value) => {
  return {
    type: ActionTypes.SET_PAYLATER_STATUS,
    payload: value,
  };
};
export const setBadRequest = (value) => {
  return {
    type: ActionTypes.SET_BAD_REQUEST,
    payload: value,
  };
};
export const setLoginUser = (value) => {
  return {
    type: ActionTypes.LOGIN_USER,
    payload: value,
  };
};
export const setLogoutUser = (value) => {
  return {
    type: ActionTypes.LOGOUT_USER,
    payload: value,
  };
};
export const setHottestDresses = (value) => {
  return {
    type: ActionTypes.GET_HOTTEST_DRESSES,
    payload: value,
  };
};
export const setUserInfo = (value) => {
  return {
    type: ActionTypes.SET_USER_INFO,
    payload: value,
  };
};
export const removeSelectedProduct = () => {
  return {
    type: ActionTypes.REMOVE_SELECTED_PRODUCT,
  };
};
export const setWishlistData = (data) => {
  return {
    type: ActionTypes.SET_WISHLIST_DATA,
    payload: data,
  };
};
export const setWishlistCount = (data) => {
  return {
    type: ActionTypes.SET_WISHLIST_COUNT,
    payload: data,
  };
};
