import api from "./api/useApi";
import { AxiosError } from "axios";
import { Profile, CompanyProfile } from "@/types/AuthTypes";


const extractErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string; error?: string }>;
  return err.response?.data?.message || err.response?.data?.error || fallback;
};

export const getUsers = async (): Promise<Profile[]> => {
  try {
    const response = await api.get<{ users: Profile[] }>("admin/usermanagment", {
      withCredentials: true,
    });

    // Map API response to Profile[]
    return response.data.users.map((p) => ({
      id: p.id, // fallback if backend uses userId
      name: p.name,
      email: p.email,
      phone: p.phone || "",
      location: p.location || "",
      bio: p.bio || "",
      profileImage: p.profileImage || "",
    }));
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch users"));
  }
};

export const searchUsers = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const response = await api.get(
      `admin/users-search?q=${query}&page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return {
      users: response.data.users,       // ✅ from controller
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages
    };
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to search data")
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
      `admin/companies-search?q=${query}&page=${page}&limit=${limit}&status=${status}`,
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
      extractErrorMessage(error, "Failed to search companies")
    );
  }
};


export const getCompanies = async (): Promise<CompanyProfile[]> => {
  try {
    const response = await api.get<{ companies: CompanyProfile[] }>("admin/companies", {
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
    throw new Error(extractErrorMessage(error, "Failed to fetch companies"));
  }
};

// Approve or reject a company
export const verifyCompany = async (companyId: string, approve: boolean, reason?: string) => {
  try {
    const response = await api.post(
      "admin/verify-company",
      { companyId, approve, reason },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to verify company"));
  }
};

export const toggleUserBlockStatus = async (userId: string, isBlocked: boolean) => {
  try {
    const response = await api.patch("admin/users/block", { id: userId, isBlocked }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update user block status"));
  }
};

export const toggleCompanyBlockStatus = async (companyId: string, isBlocked: boolean) => {
  try {
    const response = await api.patch("admin/companies/block", { id: companyId, isBlocked }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update company block status"));
  }
};

export const getAllBookings = async () => {
  try {
    const response = await api.get("admin/bookings", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch bookings"));
  }
};

export const getRevenue = async () => {
  try {
    const response = await api.get("admin/revenue", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch revenue stats"));
  }
};

export const initiatePayout = async (bookingId: string) => {
  try {
    const response = await api.post("admin/payout", { bookingId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to initiate payout"));
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

    const response = await api.get(`admin/transactions?${queryParams.toString()}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch transactions"));
  }
};

