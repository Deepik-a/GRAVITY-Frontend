import { log } from "console";

export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

