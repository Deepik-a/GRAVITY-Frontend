import api from "./api/useApi";
import { AxiosError } from "axios";
import { SignupData, LoginData, AuthResponse, GoogleAuthResponse,Profile } from "@/types/authTypes";

/**
 * Utility function to extract a safe error message
 */
const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ error?: string; message?: string }>;
  return (
    err.response?.data?.error ||
    err.response?.data?.message ||
    fallback
  );
};

/**
 * ✅ Signup User
 * Backend should set cookies (accessToken, refreshToken)
 */
export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  console.log("📩 Reached signupUser service");

  try {
    const response = await api.post<AuthResponse>("/signup", data, {
      withCredentials: true, // include cookies
    });

    console.log("✅ Signup Success:", response.data);
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Signup failed — unexpected error occurred.");
    console.error("❌ Signup Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Login User
 * Backend sets cookies, frontend does not manually store tokens
 */
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  console.log("📩 Reached loginUser service");

  try {
    const response = await api.post<AuthResponse>("/login", data, {
      withCredentials: true,
    });

    console.log("✅ Login Success:", response.data);
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Login failed — unexpected error occurred.");
    console.error("❌ Login Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Verify OTP
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<AuthResponse> => {
  console.log("📩 Verifying OTP for:", email);
  try {
    const response = await api.post<AuthResponse>(
      "/verify-otp",
      { email, otp },
      { withCredentials: true }
    );

    console.log("✅ OTP Verified:", response.data);
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "OTP verification failed — unexpected error occurred.");
    console.error("❌ OTP Verification Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Resend OTP
 */
export const resendOtp = async (email: string): Promise<{ message: string }> => {
  console.log("📨 Reached resendOtp service, email:", email);
  try {
    const response = await api.post<{ message: string }>("/resend-otp", { email });
    console.log("✅ Resend OTP Response:", response.data.message);
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Resend OTP failed — unexpected error occurred.");
    console.error("❌ Resend OTP Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Forgot Password
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Forgot Password failed — unexpected error occurred.");
    console.error("❌ Forgot Password Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Verify Forgot Password OTP
 */
export const verifyForgotOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("/verify-forgot-otp", { email, otp });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Verify Forgot OTP failed — unexpected error occurred.");
    console.error("❌ Verify Forgot OTP Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Reset Password
 */
export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await api.post("/reset-password", { email, newPassword });
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Reset Password failed — unexpected error occurred.");
    console.error("❌ Reset Password Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Google Login (cookie-based)
 */
export const googleLogin = async (googleIdToken: string): Promise<GoogleAuthResponse> => {
  console.log("📩 Google login attempt");
  try {
    const response = await api.post<GoogleAuthResponse>(
      "/google",
      { token: googleIdToken },
      { withCredentials: true }
    );

    console.log("✅ Google Login Success:", response.data);
    return response.data;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Google login failed — unexpected error occurred.");
    console.error("❌ Google Login Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * ✅ Fetch User Profile
 * (Browser automatically sends cookies with request)
 */
export const getProfile = async () => {
  try {
       const response = await api.get("/profile", { withCredentials: true });
    const profile = response.data.profile;

    // 🧩 Transform backend fields → frontend shape
    const transformedProfile: Profile = {
      id: profile.userId,               // ✅ rename
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      profileImage: profile.profileImage || "",
    };

    return transformedProfile;
  } catch (error) {
    const errorMsg = extractErrorMessage(error, "Failed to fetch user profile.");
    console.error("❌ Get Profile Error:", errorMsg);
    throw new Error(errorMsg);
  }
};
