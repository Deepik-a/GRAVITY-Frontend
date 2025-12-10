import api from "./api/useApi";
import { AxiosError } from "axios";
import {
  SignupData,
  LoginData,
  AuthResponse,
  GoogleAuthResponse,
  Profile,
} from "@/types/authTypes";

const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ error?: string; message?: string }>;
  return (
    err.response?.data?.error ||
    err.response?.data?.message ||
    fallback
  );
};

const AUTH = "/auth";
const ADMIN = "/admin";

// --------------------------------------------------
// GENERIC POST WRAPPER
// --------------------------------------------------
const post = async (endpoint: string, body: unknown, fallback: string) => {
  try {
    const response = await api.post(endpoint, body, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, fallback));
  }
};

// --------------------------------------------------
// USER / COMPANY SIGNUP
// --------------------------------------------------
export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  return post(`${AUTH}/signup`, data, "Signup failed");
};

// --------------------------------------------------
// USER / COMPANY LOGIN
// --------------------------------------------------
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  return post(`${AUTH}/login`, data, "Login failed");
};

// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------
export const loginAdmin = async (
  data: LoginData
): Promise<{ accessToken: string; refreshToken: string; message: string }> => {
  return post(`${ADMIN}/login`, data, "Admin login failed");
};

// --------------------------------------------------
// FORGOT PASSWORD
// --------------------------------------------------
export const forgotPassword = (email: string) =>
  post(`${AUTH}/forgot-password`, { email }, "Forgot password failed");

// --------------------------------------------------
// VERIFY OTP
// --------------------------------------------------
export const verifyOtp = (email: string, otp: string, purpose: string) =>
  post(`${AUTH}/verify-otp`, { email, otp, purpose }, "Verify OTP failed");

// --------------------------------------------------
// RESEND OTP
// --------------------------------------------------
export const resendOtp = (email: string) =>
  post(`${AUTH}/resend-otp`, { email }, "Resend OTP failed");

// --------------------------------------------------
// RESET PASSWORD
// --------------------------------------------------
export const resetPassword = (email: string, newPassword: string) =>
  post(`${AUTH}/reset-password`, { email, newPassword }, "Reset password failed");

// --------------------------------------------------
// GOOGLE LOGIN
// --------------------------------------------------
export const googleLogin = async (
  googleIdToken: string,
  role?: string
): Promise<GoogleAuthResponse> => {
  return post(
    `${AUTH}/google`,
    { token: googleIdToken, role },
    "Google login failed"
  );
};

// --------------------------------------------------
// GET PROFILE
// --------------------------------------------------
export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get(`${AUTH}/profile`, {
      withCredentials: true,
    });

    const p = response.data.profile;

    return {
      id: p.userId,
      name: p.name,
      email: p.email,
      phone: p.phone || "",
      location: p.location || "",
      bio: p.bio || "",
      profileImage: p.profileImage || "",
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch profile"));
  }
};
