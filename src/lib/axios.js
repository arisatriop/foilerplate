import axios from "axios";
import { authToken } from "./api/AuthApi";

// === Axios Instances ===
export const axiosGoilerplateInstance = axios.create({
  baseURL: import.meta.env.VITE_GOILERPLATE_API_BASE_URL,
});

export const axiosReqresInstance = axios.create({
  baseURL: import.meta.env.VITE_REQRES_API_BASE_URL,
});

// === Helper: Setup Auth Interceptor ===
const setupAuthInterceptor = (
  axiosInstance,
  getRefreshToken,
  setAccessToken
) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.skipAuthInterceptor // ✅ check flag instead of url
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = false;

      try {
        let refreshToken = getRefreshToken();
        console.log("Using refresh token:", refreshToken);
        const refreshRes = await authToken(axiosInstance, refreshToken);
        const newAccessToken = refreshRes.data.data.accessToken;

        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";

        return Promise.reject(refreshError);
      }
    }
  );
};

// === Init Interceptor Globally ===
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setAccessToken = (newAccessToken) =>
  localStorage.setItem("accessToken", newAccessToken);

setupAuthInterceptor(axiosGoilerplateInstance, getRefreshToken, setAccessToken);
setupAuthInterceptor(axiosReqresInstance, getRefreshToken, setAccessToken);
// setupAuthInterceptor(anotherInstance, getRefreshToken, setAccessToken);
