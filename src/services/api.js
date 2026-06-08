import axiosInstance from "axios";

export const getBackendHost = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return apiURL.replace(/\/api\/v1\/?$/, "");
};

const api = axiosInstance.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;