"use client";

import { useAxiosInterceptor } from "@/services/api/useAxiosInterceptor";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/context/AuthContext";
import { ReduxProvider } from "./ReduxProvider";
import GlobalVideoCallListener from "./video/GlobalVideoCallListener";

export function Providers({ children }: { children: React.ReactNode }) {
  useAxiosInterceptor(); // Enables JWT interceptor globally

  return (
    <ReduxProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <GlobalVideoCallListener />
          {children}
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}
