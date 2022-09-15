import store from "../store/store";
import { setUserInfo } from "./dressActions";

let token = localStorage.getItem("token");

function fetchUser(getUserUrl, cb) {
  fetch(getUserUrl, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.ok) {
        cb(true);
        let userInfo = result;
        delete userInfo.ok;
        store.dispatch(setUserInfo(userInfo));
      } else {
        cb(false);
      }
    });
}

export default fetchUser;
