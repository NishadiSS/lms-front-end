import api from "./config";

const registerUser = (username, email, password, role) => {
  return api.post("/auth/register", { // Backend endpoint
    username,
    email,
    password,
    role: [role], 
  });
};

const loginUser = (username, password) => {
  return api
    .post("/auth/login", { // Backend endpoint
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logoutUser = () => {
  localStorage.removeItem("user");
};

const retrieveCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authApi = {
  registerUser,
  loginUser,
  logoutUser,
  retrieveCurrentUser,
};

export default authApi;