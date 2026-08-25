import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================

api.interceptors.response.use(
  // If response is successful
  (response) => response,

  // If response gives error
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.response.status === 401 &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        // refreshToken cookie automatically goes
        // because withCredentials: true
        const response = await api.post("/auth/refresh-token");

        const newAccessToken = response.data.accessToken;

        // VERY IMPORTANT
        localStorage.setItem("accessToken", newAccessToken);

        // Update failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry failed request
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
