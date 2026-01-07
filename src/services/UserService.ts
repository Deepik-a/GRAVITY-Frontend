import api from "./api/useApi";

const extractErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

export const getAllCompanies = async () => {
  try {
    const response = await api.get("/user/companies");
    return response.data;
  } catch (error) {
    console.error("❌ Get companies failed", error);
    throw new Error(extractErrorMessage(error, "Failed to fetch companies"));
  }
};

export const getCompanyById = async (companyId: string) => {
  try {
    const response = await api.get(`/company/profile/${companyId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get company details failed", error);
    throw new Error(extractErrorMessage(error, "Failed to fetch company details"));
  }
};

export const getAvailableSlots = async (companyId: string, date: string) => {
  try {
    const response = await api.get(`/user/slots/available`, {
      params: { companyId, date },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get available slots failed", error);
    throw new Error(extractErrorMessage(error, "Failed to fetch available slots"));
  }
};

export const bookSlot = async (bookingData: { companyId: string; date: string; startTime: string }) => {
  try {
    const response = await api.post(`/user/slots/book`, bookingData);
    return response.data;
  } catch (error) {
    console.error("❌ Book slot failed", error);
    throw new Error(extractErrorMessage(error, "Failed to book slot"));
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get("/user/bookings");
    return response.data;
  } catch (error) {
    console.error("❌ Get user bookings failed", error);
    throw new Error(extractErrorMessage(error, "Failed to fetch your bookings"));
  }
};
