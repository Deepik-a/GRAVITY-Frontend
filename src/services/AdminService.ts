import api from "./api/useApi";
import { AxiosError } from "axios";
import { Profile,CompanyProfile } from "@/types/authTypes";


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
      id: p.id , // fallback if backend uses userId
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
export const verifyCompany = async (companyId: string, approve: boolean,reason?: string) => {
  try {
    const response = await api.post(
      "admin/verify-company",
      { companyId, approve,reason },
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
