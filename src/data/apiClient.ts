import { notification } from "antd";
import axios from "axios";
import { navigateTo } from "../navigationService";
import { useAuthStore } from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.108:8080/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PUBLIC_ENDPOINTS = ["/v1/auth/login", "/v1/auth/refresh", "/v1/auth/logout"];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isPublic = PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url));

    if (isPublic) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        useAuthStore.getState().logout();
        navigateTo("/login");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/v1/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        console.log("Refresh Response:", response.data);
        const { newAccessToken, newRefreshToken } = response.data;
        useAuthStore.getState().login(newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Faield:", refreshError);
        useAuthStore.getState().logout();
        localStorage.removeItem("refreshToken");
        navigateTo("/login");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      notification.error({
        message: "Hata",
        description: error.response?.data?.message || "Beklenmeyen bir hata oluştu",
        placement: "topRight",
        duration: 3,
      });
      useAuthStore.getState().logout();
      localStorage.removeItem("accessToken");
      navigateTo("/login");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export const logoutRequest = () => {
  const accessToken = localStorage.getItem("accessToken");
  return axios.post(
    `${axiosInstance.defaults.baseURL}/v1/auth/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};
export default axiosInstance;
