import api from "./api/useApi";
import { extractAxiosError } from "@/utils/HandleAxiosError";
import { CompanyProfile } from "@/types/AuthTypes";
import { Booking } from "@/types/BookingTypes";
import { API_ROUTES } from "@/shared/constants/routes";

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ExceptionalDay {
  date: string;
  reason: string;
}

export interface SlotConfig {
  id?: string;
  companyId?: string;
  startDate: string;
  endDate: string;
  weekdays: string[];
  exceptionalDays: ExceptionalDay[];
}

export const getAllCompanies = async (params: Record<string, unknown> = {}): Promise<{ companies: CompanyProfile[]; total: number; totalPages: number }> => {
  try {
    const response = await api.get<{ companies: CompanyProfile[]; total: number; totalPages: number }>(API_ROUTES.USER.COMPANIES, { params });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getCompanyById = async (companyId: string): Promise<CompanyProfile> => {
  try {
    const response = await api.get<CompanyProfile>(`${API_ROUTES.USER.COMPANIES}/${companyId}/profile`);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getAvailableSlots = async (companyId: string, date: string): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(API_ROUTES.USER.SLOTS_AVAILABLE, {
      params: { companyId, date, _t: Date.now() },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get available slots failed", error);
    throw new Error(extractAxiosError(error));
  }
};

export const getSlotConfig = async (companyId: string): Promise<SlotConfig> => {
  try {
    const response = await api.get<SlotConfig>(`${API_ROUTES.USER.COMPANIES}/${companyId}/slots/config`, {
      params: { _t: Date.now() },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get slot config failed", error);
    throw new Error(extractAxiosError(error));
  }
};

export const bookSlot = async (bookingData: { companyId: string; date: string; startTime: string }): Promise<Booking> => {
  try {
    const response = await api.post<Booking>(API_ROUTES.USER.BOOK_SLOT, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getUserBookings = async (page?: number, limit?: number): Promise<{ bookings: Booking[]; total: number }> => {
  try {
    const response = await api.get<{ bookings: Booking[]; total: number }>(API_ROUTES.USER.BOOKINGS, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const createCheckoutSession = async (bookingId: string) => {
  try {
    const response = await api.post("/payments/create-checkout-session", { bookingId });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const verifyPaymentSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  message?: string;
  bookingId?: string;
  sessionId?: string;
  booking?: Booking;
}> => {
  try {
    const response = await api.get<{
      success: boolean;
      message?: string;
      bookingId?: string;
      sessionId?: string;
      booking?: Booking;
    }>("/payments/verify-session", {
      params: { sessionId }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getFavourites = async () => {
  try {
    const response = await api.get(API_ROUTES.USER.FAVOURITES);
    return response.data.favourites;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const toggleFavourite = async (companyId: string) => {
  try {
    const response = await api.post(API_ROUTES.USER.FAVOURITES, { companyId });
    return response.data.favourites;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const changePassword = async (data: Record<string, unknown>) => {
  try {
    const response = await api.patch(API_ROUTES.USER.PROFILE_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const submitReview = async (data: { companyId: string; rating: number; comment: string }) => {
  try {
    const response = await api.post(`${API_ROUTES.USER.COMPANIES}/${data.companyId}/reviews`, { rating: data.rating, comment: data.comment });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getCompanyReviews = async (companyId: string) => {
   try {
     const response = await api.get(`${API_ROUTES.USER.COMPANIES}/${companyId}/reviews`);
     return response.data;
   } catch (error) {
     throw new Error(extractAxiosError(error));
   }
};
 
 export const completeBooking = async (bookingId: string) => {
   try {
     const response = await api.patch(`${API_ROUTES.USER.BOOKINGS}/${bookingId}/complete`);
     return response.data;
   } catch (error) {
     throw new Error(extractAxiosError(error));
   }
 };
export const getPublicStats = async () => {
  const response = await api.get(API_ROUTES.USER.STATS);
  return response.data;
};
