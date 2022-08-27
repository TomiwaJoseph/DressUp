import {
  CLEAN_CART,
  GET_ALL_CATEGORIES,
  GET_ALL_DRESSES,
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

const dressReducer = (state, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return {
        ...state,
        allCategoriesData: action.payload,
      };
    case SET_BAD_URL:
      return {
        ...state,
        badUrl: true,
      };
    case GET_SINGLE_DRESS:
      return {
        ...state,
        singleDressData: action.payload,
      };
    case GET_RELATED_DRESS:
      return {
        ...state,
        relatedDressData: action.payload,
      };
    case SET_CART_COUNT:
      return {
        ...state,
        cartCount: action.payload,
      };
    case CLEAN_CART:
      return {
        ...state,
        cartDataToRender: [],
        cartCount: 0,
      };
    case GET_HOTTEST_DRESSES:
      return {
        ...state,
        hotDressesData: action.payload,
      };
    case GET_HIGHEST_PRICE:
      return {
        ...state,
        highestDressPrice: action.payload,
      };
    case GET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategoryData: action.payload,
      };
    case SET_CART_DATA:
      return {
        ...state,
        cartDataToRender: action.payload,
      };
    case IS_FETCHING_DATA:
      return {
        ...state,
        fetchingData: action.payload,
      };
    case NO_INTERNET:
      return {
        ...state,
        noInternet: action.payload,
      };
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default dressReducer;
