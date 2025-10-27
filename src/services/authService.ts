import api from "./api/useApi";
import { AxiosError } from "axios";
import { SignupData, LoginData, AuthResponse } from "@/types/authTypes";
import { setToken } from "@/utils/tokenHelper";

export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  console.log("reached signupUser from authService")
  try {
    const response = await api.post<AuthResponse>("/signup", data);

    console.log("✅ Signup Response:", response.data);
    console.log("📩 Message:", response.data.message);
    console.log("🔑 Token:", response.data.token);
    console.log("👤 User:", response.data.user);

    if (response.data.token) {
      setToken(response.data.token);
    }

    return response.data;

  } catch (error) {
    const err = error as AxiosError<{ error?: string; message?: string }>;

    const errorMsg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Signup failed — unexpected error occurred.";

    console.error("❌ Signup Error:", errorMsg);
    throw new Error(errorMsg); // rethrow so the caller can handle it (UI alert, etc.)
  }
};



export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  console.log("hello from login auth");
  try {
    const response = await api.post<AuthResponse>("/login", data);
    console.log(data, "Data from auth");
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  }catch (error) {
    const err = error as AxiosError<{ error?: string; message?: string }>;

    const errorMsg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login failed — unexpected error occurred.";

    console.error("❌ Login Error:", errorMsg);
    throw new Error(errorMsg); 
  }
};
