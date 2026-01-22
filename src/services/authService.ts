import api from "./api/useApi";
import { AxiosError } from "axios";
import {
  SignupData,
  LoginData,
  AuthResponse,
  GoogleAuthResponse,
  Profile,
} from "@/types/AuthTypes";

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const err = error as AxiosError<any>;

    const backendError =
      err.response?.data?.message ||
      err.response?.data?.error;

    if (typeof backendError === "string") {
      return backendError;
    }
  }

  return fallback;
};

const AUTH = "/auth";
const ADMIN = "/admin";
const USER="/user"

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
    const response = await api.get(`${USER}/profile`, {
      withCredentials: true,
    });

    const p = response.data.profile;

    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      phone: p.phone || "",
      location: p.location || "",
      bio: p.bio || "",
      profileImage: p.profileImage || "",
      isBlocked: p.isBlocked || false,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch profile"));
  }
};

export const updateProfile = async (data: Partial<Profile>): Promise<Profile> => {
  try {
    const response = await api.put(`${USER}/profile`, data, {
      withCredentials: true,
    });
     const p = response.data.profile;
     return {
      id: p.id,
      name: p.name,
      role: p.role,
      email: p.email,
      phone: p.phone || "",
      location: p.location || "",
      bio: p.bio || "",
      profileImage: p.profileImage || "",
      isBlocked: p.isBlocked || false,
     }
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update profile"));
  }
};

export const uploadProfileImage = async (file: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post(`${USER}/profile/image`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to upload image"));
  }
};

export const deleteProfileField = async (field: keyof Profile): Promise<void> => {
  try {
    // We can implement this by updating the profile with an empty value for the field
    // OR by calling a specific DELETE endpoint if the backend supports it.
    // For now, let's assume we call a specific endpoint or use a special update.
    // Let's use a specific endpoint for clarity as per the function name.
    await api.patch(`${USER}/profile/field`, { field }, {
        withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete field"));
  }
};
