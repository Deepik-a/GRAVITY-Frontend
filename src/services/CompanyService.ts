import api from "./api/useApi";
import { AxiosError } from "axios";
import { API_ROUTES } from "@/shared/constants/AppRoutes";
import { CompanyProfile } from "@/types/AuthTypes";
import { MESSAGES } from "@/shared/constants/Messages";

export interface DashboardStats {
  totalConsultations: number;
  completedProjects: number;
  monthlyEarnings: number;
  averageRating: number;
  statusBreakdown: { status: string; count: number }[];
  revenueTrends: { month: string; amount: number }[];
  walletBalance: number;
  isSubscribed: boolean;
  documentStatus: string;
}

export interface CompanyServiceProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  isSubscribed?: boolean;
  documentStatus: "pending" | "verified" | "rejected";
  profile?: CompanyProfile['profile'];
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string; error?: string }>;
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    fallback
  );
};

export const uploadCompanyDocuments = async (formData: FormData) => {
  try {
    console.log(" uploadCompanyDocuments called");

    const response = await api.post(API_ROUTES.COMPANY.VERIFICATION, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload successful!");
    return response.data;

  } catch (error) {
    console.error(" Upload failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.UPLOAD_FAILED));
  }
};

export const uploadCompanyImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post(API_ROUTES.COMPANY.PROFILE_IMAGE, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  } catch (error) {
    console.error(" Upload image failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.UPLOAD_IMAGE_FAILED));
  }
};

export const getProfile = async (companyId: string): Promise<CompanyServiceProfile> => {
  try {
    const response = await api.get<CompanyServiceProfile>(`${API_ROUTES.USER.COMPANIES}/${companyId}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Get profile failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.GET_PROFILE_FAILED));
  }
};

export const getMyProfile = async (): Promise<CompanyServiceProfile> => {
  try {
    const response = await api.get<CompanyServiceProfile>(API_ROUTES.COMPANY.ME, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Get my profile failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.GET_MY_PROFILE_FAILED));
  }
};

export const saveProfile = async (companyId: string, profileData: Record<string, unknown>) => {
  try {
    const response = await api.patch(API_ROUTES.COMPANY.PROFILE, { companyId, profileData }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Save profile failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.SAVE_PROFILE_FAILED));
  }
};

export const deleteProfile = async (companyId: string) => {
  try {
    const response = await api.delete(API_ROUTES.COMPANY.PROFILE, {
      data: { companyId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Delete profile failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.DELETE_PROFILE_FAILED));
  }
};

export const setSlotConfig = async (config: Record<string, unknown>) => {
  try {
    const response = await api.patch(API_ROUTES.COMPANY.SLOTS_CONFIG, config, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Set slot config failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.SET_SLOT_CONFIG_FAILED));
  }
};

export const getSlotConfigs = async () => {
  try {
    const response = await api.get(API_ROUTES.COMPANY.SLOTS_CONFIG, {
      withCredentials: true,
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data ? [data] : [];
  } catch (error) {
    console.error(" Get slot configs failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.GET_SLOT_CONFIGS_FAILED));
  }
};

export const deleteSlotConfig = async (ruleId: string) => {
  try {
    const response = await api.delete(API_ROUTES.COMPANY.SLOTS_CONFIG, {
      params: { ruleId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete slot config failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.DELETE_SLOT_CONFIG_FAILED));
  }
};

export const getCompanyBookings = async (page?: number, limit?: number) => {
  try {
    const response = await api.get(API_ROUTES.COMPANY.BOOKINGS, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Get company bookings failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.GET_COMPANY_BOOKINGS_FAILED));
  }
};

export const getWallet = async () => {
  try {
    const response = await api.get(API_ROUTES.COMPANY.WALLET, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Get wallet failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_WALLET_FAILED));
  }
};

export const rescheduleBooking = async (bookingId: string, newDate: string, newStartTime: string) => {
  try {
    const response = await api.patch(`${API_ROUTES.COMPANY.BOOKING_UPDATE.replace(":bookingId", bookingId)}/reschedule`, {
      newDate,
      newStartTime
    }, {
      withCredentials: true,
      headers: {
        'x-role': 'company'
      }
    });
    return response.data;
  } catch (error) {
    console.error(" Reschedule booking failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.RESCHEDULE_BOOKING_FAILED));
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await api.patch(`${API_ROUTES.COMPANY.BOOKING_UPDATE.replace(":bookingId", bookingId)}/cancel`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Cancel booking failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.CANCEL_BOOKING_FAILED));
  }
};

export const getCompanyAvailableSlots = async (companyId: string, date: string): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(API_ROUTES.USER.SLOTS_AVAILABLE, {
      params: { companyId, date, _t: Date.now() },
      withCredentials: true,
      headers: {
        'x-role': 'company'
      }
    });
    return response.data;
  } catch (error) {
    console.error(" Get available slots failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.GET_SLOT_CONFIGS_FAILED));
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>(API_ROUTES.COMPANY.DASHBOARD_STATS, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(" Get dashboard stats failed", error);
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_DASHBOARD_STATS_FAILED));
  }
};
