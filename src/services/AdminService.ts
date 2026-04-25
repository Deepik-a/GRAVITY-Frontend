import api from "./api/useApi";
import { AxiosError } from "axios";
import { Profile, CompanyProfile } from "@/types/AuthTypes";
import { API_ROUTES } from "@/shared/constants/AppRoutes";
import { MESSAGES } from "@/shared/constants/Messages";


const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string; error?: string }>;
  return err.response?.data?.message || err.response?.data?.error || fallback;
};

export const getUsers = async (): Promise<Profile[]> => {
  try {
    const response = await api.get<{ users: Profile[] }>(API_ROUTES.ADMIN.USER_MANAGEMENT, {
      withCredentials: true,
    });

    console.log("API Response:", response.data);
    // Map API response to Profile[]
    return response.data.users.map((p) => ({
      id: p.id, // fallback if backend uses userId
      name: p.name,
      email: p.email,
      phone: p.phone || "",
      location: p.location || "",
      bio: p.bio || "",
      profileImage: p.profileImage || "",
      isBlocked: p.isBlocked || false,
      role: p.role || "user",
      bookingCount: p.bookingCount || 0,
    }));
    
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_USERS_FAILED));
  }
};

export const searchUsers = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const response = await api.get(
      `${API_ROUTES.ADMIN.USERS_SEARCH}?q=${query}&page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return {
      users: response.data.users,       //  from controller
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, MESSAGES.SERVICE.SEARCH_DATA_FAILED)
    );
  }
};




export const searchCompanies = async (
  query: string,
  page: number,
  limit: number,
  status: string = "all"
) => {
  try {
    const response = await api.get(
      `${API_ROUTES.ADMIN.COMPANIES_SEARCH}?q=${query}&page=${page}&limit=${limit}&status=${status}`,
      { withCredentials: true }
    );

    return {
      companies: response.data.companies,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, MESSAGES.SERVICE.SEARCH_COMPANIES_FAILED)
    );
  }
};


export const getCompanies = async (): Promise<CompanyProfile[]> => {
  try {
    const response = await api.get<{ companies: CompanyProfile[] }>(API_ROUTES.ADMIN.COMPANY_MANAGEMENT, {
      withCredentials: true,
    });

    // Map backend response to CompanyProfile[]
    return response.data.companies.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      role: c.role,
      status: c.status,
      documentStatus: c.documentStatus,
      documents: c.documents,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_COMPANIES_FAILED));
  }
};

// Approve or reject a company
export const verifyCompany = async (companyId: string, approve: boolean, reason?: string) => {
  try {
    const response = await api.patch(
      API_ROUTES.ADMIN.COMPANY_VERIFY.replace(":companyId", companyId),
      { approve, reason },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.VERIFY_COMPANY_FAILED));
  }
};

export const toggleUserBlockStatus = async (userId: string, isBlocked: boolean) => {
  try {
    const response = await api.patch(
      API_ROUTES.ADMIN.USER_BLOCK.replace(":userId", userId),
      { isBlocked },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.UPDATE_USER_BLOCK_STATUS_FAILED));
  }
};

export const toggleCompanyBlockStatus = async (companyId: string, isBlocked: boolean) => {
  try {
    const response = await api.patch(
      API_ROUTES.ADMIN.COMPANY_BLOCK.replace(":companyId", companyId),
      { isBlocked },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.UPDATE_COMPANY_BLOCK_STATUS_FAILED));
  }
};

export const getAllBookings = async (page: number = 1, limit: number = 10, search: string = "") => {
  try {
    const response = await api.get(`${API_ROUTES.ADMIN.BOOKINGS}?page=${page}&limit=${limit}&search=${search}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_BOOKINGS_FAILED));
  }
};

export const getRevenue = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN.REVENUE, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_REVENUE_STATS_FAILED));
  }
};

export const refundBooking = async (bookingId: string) => {
  try {
    const response = await api.patch(API_ROUTES.ADMIN.BOOKING_REFUND.replace(":bookingId", bookingId), {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.REFUND_BOOKING_FAILED));
  }
};

export const initiatePayout = async (bookingId: string) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN.BOOKING_PAYOUT.replace(":bookingId", bookingId), {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.INITIATE_PAYOUT_FAILED));
  }
};

export const getTransactions = async (filters: {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    const response = await api.get(`${API_ROUTES.ADMIN.TRANSACTIONS}?${queryParams.toString()}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_TRANSACTIONS_FAILED));
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN.DASHBOARD_STATS, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.FETCH_DASHBOARD_STATS_FAILED));
  }
};

