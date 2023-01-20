import axios from "axios";
import store from "../store/store";
import { setUserInfo } from "./dressActions";

let token = localStorage.getItem("dressupToken");

export const fetchUser = async (getUserUrl, cb) => {
  await axios
    .get(getUserUrl, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((result) => {
      let userInfo = result.data;
      delete userInfo.ok;
      store.dispatch(setUserInfo(userInfo));
      cb(true);
    })
    .catch((err) => {
      cb(false);
    });
};
