import api from "./api/useApi";
import { extractAxiosError } from "@/utils/HandleAxiosError";

export const getAllCompanies = async (params: Record<string, unknown> = {}) => {
  try {
    const response = await api.get("/user/companies", { params });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getCompanyById = async (companyId: string) => {
  try {
    const response = await api.get(`/company/profile/${companyId}`);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getAvailableSlots = async (companyId: string, date: string) => {
  try {
    const response = await api.get(`/user/slots/available`, {
      params: { companyId, date },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const bookSlot = async (bookingData: { companyId: string; date: string; startTime: string }) => {
  try {
    const response = await api.post(`/user/slots/book`, bookingData);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get("/user/bookings");
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

export const verifyPaymentSession = async (sessionId: string) => {
  try {
    const response = await api.get("/payments/verify-session", {
      params: { sessionId }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getFavourites = async () => {
  try {
    const response = await api.get("/user/profile/favourites");
    return response.data.favourites;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const toggleFavourite = async (companyId: string) => {
  try {
    const response = await api.post("/user/profile/favourites", { companyId });
    return response.data.favourites;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const changePassword = async (data: Record<string, unknown>) => {
  try {
    const response = await api.put("/user/profile/password", data);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const submitReview = async (data: { companyId: string; rating: number; comment: string }) => {
  try {
    const response = await api.post("/user/reviews", data);
    return response.data;
  } catch (error) {
    throw new Error(extractAxiosError(error));
  }
};

export const getCompanyReviews = async (companyId: string) => {
   try {
     const response = await api.get(`/user/companies/${companyId}/reviews`);
     return response.data;
   } catch (error) {
     throw new Error(extractAxiosError(error));
   }
};
 
 export const completeBooking = async (bookingId: string) => {
   try {
     const response = await api.patch(`/user/bookings/${bookingId}/complete`);
     return response.data;
   } catch (error) {
     throw new Error(extractAxiosError(error));
   }
 };
