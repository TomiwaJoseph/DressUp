let token = localStorage.getItem("token");
const getUserUrl = "http://localhost:8000/api/auth/user/";
let jsonData;

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

export const anotherData = fetchUser;
export default fetchUser;
