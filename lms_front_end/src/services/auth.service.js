import api from "./api";

const register = (username, email, password, roles) => {
  return api.post("/auth/register", {
    username,
    email,
    password,
    role: roles,
  });
};

const login = (username, password) => {
  return api
    .post("/auth/login", {
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

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;