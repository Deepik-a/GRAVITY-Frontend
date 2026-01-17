import { useEffect } from "react";
import api from "./useApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useAxiosInterceptor = () => {
    const router = useRouter();

  useEffect(() => {
    // Request interceptor: no need to manually attach tokens
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Cookies (accessToken, refreshToken) are automatically sent by the browser
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 errors (e.g., expired token)
   const responseInterceptor = api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 എറർ വരികയും ഇതേ റിക്വസ്റ്റ് മുൻപ് retry ചെയ്യാതിരിക്കുകയും ആണെങ്കിൽ
    const isAuthRoute = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register") || originalRequest.url?.includes("/auth/google");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      console.warn("Access token expired, retrying with new cookie...");
      
      try {
        // ബാക്കെൻഡ് ഇതിനകം കുക്കി പുതുക്കിയിട്ടുണ്ടാകും, അതിനാൽ റിക്വസ്റ്റ് വീണ്ടും അയക്കുന്നു
        return await api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    if (error.response?.status === 403 && error.response?.data?.message === "Your account has been blocked. Please contact admin.") {
      toast.error("You have been removed from the site, contact admin");
    }

    return Promise.reject(error);
  }
);
    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);
};
