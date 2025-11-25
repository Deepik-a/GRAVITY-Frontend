// TypeScript for compile-time type safety.
// Zod / Yup / class-validator for runtime validation.

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'company'; // <-- add role here
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  role:string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}


export interface GoogleAuthResponse {
  message: string;
  user: {
    name: string;
    email: string;
    token: string;
    role: 'user' | 'company';
    isPending?: boolean; // optional for users
  };
  isNewUser: boolean;
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


export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "pending" | "verified" | "blocked";
  documentStatus: "pending" | "verified" | "rejected";
  documents: {
      GST_Certificate: string;
  RERA_License: string;
  Trade_License: string;
  }
  createdAt: string;
  updatedAt: string;
}