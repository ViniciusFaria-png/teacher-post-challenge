import axios from "axios";
import { globalCONFIG } from "../global-config";

const axiosInstance = axios.create({
  baseURL: globalCONFIG.serverURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

export const endpoints = {
  posts: "/posts",
  user: "/user",
  teacher: "/teacher",
};
