import axios from "axios";

const apiClient = axios.create({
  // baseURL: process.env.API_URL,
  withCredentials: true,
  xsrfCookieName: "token",
});

export default apiClient;
