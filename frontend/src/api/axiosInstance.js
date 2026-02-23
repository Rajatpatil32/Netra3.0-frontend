import axios from "axios";
import { showLoader, hideLoader } from "../utils/loader";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000
});


// request interceptor
api.interceptors.request.use(
  (config) => {
    showLoader();
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);


// response interceptor
api.interceptors.response.use(
  (response) => {
    hideLoader();
    return response.data;
  },
  (error) => {
    hideLoader();

    if (error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Server not reachable");
  }
);

export default api;