import axios, { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

const authorizedAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

authorizedAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response } = error;

    if (response) {
      if (
        response.status === 401 &&
        response.data?.message === "Invalid access token"
      ) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${BASE_URL}/a/refresh-token`,
              {},
              {
                headers: {
                  "x-refresh-token": refreshToken,
                },
              }
            );
            console.log("New access token:", data.accessToken);

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            if (error.config) {
              error.config.headers[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;

              return axios.request(error.config);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            toast.error("Session expired. Please log in again.");
            localStorage.clear();
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        } else {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }
      }
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (response.status === 404) {
        window.location.href = "/error404";
      } else if (status === 403) {
        if (
          message === "Invalid refresh token" ||
          message === "Invalid or expired refresh token"
        ) {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/";
        } else if (message === "Invalid access token") {
          toast.error("Authentication failed. Please log in.");
          window.location.href = "/";
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } else {
      toast.error("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, authorizedAxios };
