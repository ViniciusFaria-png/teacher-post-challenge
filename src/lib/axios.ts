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

export default axiosInstance;

export const endpoints = {
  posts: "/posts",
  user: "/user",
};
