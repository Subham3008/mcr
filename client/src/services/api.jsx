import axios from "axios";

import { getAccessToken, setAccessToken, clearAccessToken } from "./TokenStore";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Refresh ke liye separate axios instance
export const authApi = axios.create({
  baseURL,
  withCredentials: true,
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ========================================
// REFRESH TOKEN HANDLING
// ========================================

// Agar same time multiple API 401 de dein,
// multiple refresh requests ko avoid karega
let refreshPromise = null;

const getNewAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post("/auth/refresh-token")
      .then((response) => {
        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expire hua
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // HttpOnly refresh cookie automatically jayegi
        const newAccessToken = await getNewAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Failed request dobara
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
