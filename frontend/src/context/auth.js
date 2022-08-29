let token = localStorage.getItem("token");

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
