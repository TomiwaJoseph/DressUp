// import { LOGIN_USER } from "./dress-actions";

let token = localStorage.getItem("token");
// const getUserUrl = "http://localhost:8000/api/auth/user/";

function fetchUser(getUserUrl, cb) {
  fetch(getUserUrl, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.ok)
    .then((result) => {
      cb(result);
    });
}

export default fetchUser;
