import { useEffect } from "react";
import api from "./useApi";
import { getToken } from "@/utils/tokenHelper";

export const useAxiosInterceptor = () => {
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized - token expired or invalid");
          // Handle token refresh or logout logic
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);
};
