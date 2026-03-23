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
    id: string;
    name: string;
    email: string;
    phone: string;
    isProfileFilled?: boolean;
    isSubscribed?: boolean;
  };
  documentStatus?: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}


export interface GoogleAuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
    role: 'user' | 'company';
    isProfileFilled?: boolean;
    isSubscribed?: boolean;
  };
  isNewUser: boolean;
 documentStatus?:"pending"|"verified"|"rejected";
}


export type Profile = {
  id: string;         // ✅ matches backend field name
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;           // ✅ lowercase 'bio'
  profileImage?: string;
  isBlocked?: boolean;
  role?: string;
  bookingCount?:number;
};


export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  role: string;
  status: "pending" | "verified" | "blocked";
  documentStatus: "pending" | "verified" | "rejected";  // <-- THIS MUST EXIST
    rejectReason?: string;  // <-- NEW FIELD
  documents: {
    GST_Certificate?: string;
    RERA_License?: string;
    Trade_License?: string;
  };
  createdAt: string;
  updatedAt: string;
  isBlocked?: boolean;
  isProfileFilled?: boolean;
  isSubscribed?: boolean;
  profile?: {
    companyName?: string;
    location?: string;
    categories: string[];
    services: string[];
    consultationFee: number;
    establishedYear: number;
    companySize: string;
    overview: string;
    projectsCompleted: number;
    happyCustomers: number;
    awardsWon: number;
    awardsRecognition: string;
    contactOptions: {
      chatSupport: boolean;
      videoCalls: boolean;
    };
    teamMembers: {
      id: number;
      name: string;
      qualification: string;
      role: string;
      photo?: string;
    }[];
    projects: {
      id: number;
      title: string;
      description: string;
      beforeImage?: string;
      afterImage?: string;
      date?: string;
    }[];
    brandIdentity: {
      logo?: string;
      banner1?: string;
      banner2?: string;
      profilePicture?: string;
    };
  } | null;
}
