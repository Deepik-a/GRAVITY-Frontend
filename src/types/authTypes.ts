// TypeScript for compile-time type safety.
// Zod / Yup / class-validator for runtime validation.

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}


export interface GoogleAuthResponse {
  message: string;
  data: {
    name: string;
    email: string;
    token: string;
  };
}

export type Profile = {
  id: string;         // ✅ matches backend field name
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;           // ✅ lowercase 'bio'
  profileImage?: string;
};

