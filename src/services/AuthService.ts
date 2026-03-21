import api from "./api/useApi";
import { API_ROUTES } from "@/shared/constants/routes";
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
    const err = error as AxiosError<{ message?: string; error?: string }>;

    const backendError =
      err.response?.data?.message ||
      err.response?.data?.error;

    if (typeof backendError === "string") {
      return backendError;
    }
  }

  return fallback;
};

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
  return post(API_ROUTES.AUTH.SIGNUP, data, "Signup failed");
};

// --------------------------------------------------
// USER / COMPANY LOGIN
// --------------------------------------------------
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  return post(API_ROUTES.AUTH.LOGIN, data, "Login failed");
};

// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------
export const loginAdmin = async (
  data: LoginData
): Promise<{ accessToken: string; refreshToken: string; message: string; user: { id: string; email: string; name: string } }> => {
  return post(API_ROUTES.ADMIN.LOGIN, data, "Admin login failed");
};

// --------------------------------------------------
// FORGOT PASSWORD
// --------------------------------------------------
export const forgotPassword = (email: string) =>
  post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email }, "Forgot password failed");

// --------------------------------------------------
// VERIFY OTP
// --------------------------------------------------
export const verifyOtp = (email: string, otp: string, purpose: string) =>
  post(API_ROUTES.AUTH.VERIFY_OTP, { email, otp, purpose }, "Verify OTP failed");

// --------------------------------------------------
// RESEND OTP
// --------------------------------------------------
export const resendOtp = (email: string) =>
  post(API_ROUTES.AUTH.RESEND_OTP, { email }, "Resend OTP failed");

// --------------------------------------------------
// RESET PASSWORD
// --------------------------------------------------
export const resetPassword = (email: string, newPassword: string) =>
  post(API_ROUTES.AUTH.RESET_PASSWORD, { email, newPassword }, "Reset password failed");

// --------------------------------------------------
// GOOGLE LOGIN
// --------------------------------------------------
export const googleLogin = async (
  googleIdToken: string,
  role?: string
): Promise<GoogleAuthResponse> => {
  return post(
    API_ROUTES.AUTH.GOOGLE,
    { token: googleIdToken, role },
    "Google login failed"
  );
};

// --------------------------------------------------
// GET PROFILE
// --------------------------------------------------
export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get(API_ROUTES.USER.PROFILE, {
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
    const response = await api.patch(API_ROUTES.USER.PROFILE, data, {
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

    const response = await api.post(API_ROUTES.USER.PROFILE_IMAGE, formData, {
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
    await api.patch(API_ROUTES.USER.PROFILE_FIELD, { field }, {
        withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete field"));
  }
};

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------
export const logout = async () => {
  try {
    const response = await api.post(API_ROUTES.AUTH.LOGOUT, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Logout failed"));
  }
};
