import { ActionTypes } from "../actions/action-types";

const globalState = {
  hotDressesData: [],
  allCategoriesData: [],
  currentCategoryData: [],
  cartDataToRender: [],
  categoryDresses: [],
  singleDressData: [],
  relatedDressData: [],
  wishlistData: [],
  userOrderHistory: [],
  userOrderDetailsData: [],
  userOrderDressesData: [],
  searchResults: [],
  userInfo: {},
  wishlistCount: 0,
  cartCount: 0,
  cartTotal: 0,
  highestDressPrice: 0,
  paylaterStatus: false,
  badRequest: false,
  noInternet: false,
  fetchingData: false,
  isAuthenticated: false,
  backendUrl: "http://localhost:8000",
};

export const dressReducer = (state = globalState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_ALL_CATEGORIES:
      return {
        ...state,
        allCategoriesData: payload,
      };
    case ActionTypes.SET_BAD_REQUEST:
      return {
        ...state,
        badRequest: payload,
      };
    case ActionTypes.GET_SINGLE_DRESS:
      return {
        ...state,
        singleDressData: payload,
      };
    case ActionTypes.GET_RELATED_DRESS:
      return {
        ...state,
        relatedDressData: payload,
      };
    case ActionTypes.SET_CART_COUNT:
      return {
        ...state,
        cartCount: payload,
      };
    case ActionTypes.CLEAN_CART:
      return {
        ...state,
        cartDataToRender: [],
        cartCount: 0,
      };
    case ActionTypes.SET_PAYLATER_STATUS:
      return {
        ...state,
        paylaterStatus: payload,
      };
    case ActionTypes.GET_HOTTEST_DRESSES:
      return {
        ...state,
        hotDressesData: payload,
      };
    case ActionTypes.GET_HIGHEST_PRICE:
      return {
        ...state,
        highestDressPrice: payload,
      };
    case ActionTypes.SET_CART_DATA:
      return {
        ...state,
        cartDataToRender: payload,
      };
    case ActionTypes.SET_CART_TOTAL:
      return {
        ...state,
        cartTotal: payload,
      };
    case ActionTypes.GET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategoryData: payload,
      };
    case ActionTypes.IS_FETCHING_DATA:
      return {
        ...state,
        fetchingData: payload,
      };
    case ActionTypes.NO_INTERNET:
      return {
        ...state,
        noInternet: payload,
      };
    case ActionTypes.SET_USER_INFO:
      return {
        ...state,
        userInfo: payload,
      };
    case ActionTypes.LOGIN_USER:
      return {
        ...state,
        isAuthenticated: payload,
      };
    case ActionTypes.SET_USER_ORDER_DETAILS:
      return {
        ...state,
        userOrderDetailsData: payload,
      };
    case ActionTypes.SET_USER_ORDER_ITEMS_DATA:
      return {
        ...state,
        userOrderDressesData: payload,
      };
    case ActionTypes.LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: payload,
        userInfo: {},
        userOrderHistory: [],
      };
    case ActionTypes.REMOVE_SELECTED_PRODUCT:
      return {
        ...state,
        singleDressData: [],
      };
    case ActionTypes.SET_USER_ORDER_HISTORY:
      return {
        ...state,
        userOrderHistory: payload,
      };
    case ActionTypes.SET_WISHLIST_DATA:
      return {
        ...state,
        wishlistData: payload,
      };
    case ActionTypes.SET_WISHLIST_COUNT:
      return {
        ...state,
        wishlistCount: payload,
      };
    case ActionTypes.SET_SEARCH_RESULT:
      return {
        ...state,
        searchResults: payload,
      };
    default:
      return state;
  }
};
