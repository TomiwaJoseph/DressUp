import { combineReducers } from "redux";
import { dressReducer } from "./dressReducer";

const reducers = combineReducers({
  dress: dressReducer,
});

export default reducers;
