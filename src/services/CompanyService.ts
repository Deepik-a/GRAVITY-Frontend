import api from "./api/useApi";
import { AxiosError } from "axios";

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
    console.log("📤 uploadCompanyDocuments called");

    const response = await api.post("/company/upload-documents", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Upload successful!");
    return response.data;

  } catch (error) {
    console.error("❌ Upload failed", error);
    throw new Error(extractErrorMessage(error, "Upload failed"));
  }
};

export const uploadCompanyImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/company/profile/image", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  } catch (error) {
    console.error("❌ Upload image failed", error);
    throw new Error(extractErrorMessage(error, "Upload image failed"));
  }
};

export const getProfile = async (companyId: string) => {
  try {
    const response = await api.get(`/company/profile/${companyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get profile failed", error);
    throw new Error(extractErrorMessage(error, "Get profile failed"));
  }
};

export const getMyProfile = async () => {
  try {
    const response = await api.get("/company/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get my profile failed", error);
    throw new Error(extractErrorMessage(error, "Get my profile failed"));
  }
};

export const saveProfile = async (companyId: string, profileData: Record<string, unknown>) => {
  try {
    const response = await api.put("/company/profile", { companyId, profileData }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Save profile failed", error);
    throw new Error(extractErrorMessage(error, "Save profile failed"));
  }
};

export const deleteProfile = async (companyId: string) => {
  try {
    const response = await api.delete("/company/profile", {
      data: { companyId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Delete profile failed", error);
    throw new Error(extractErrorMessage(error, "Delete profile failed"));
  }
};

export const setSlotConfig = async (config: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/slots/config", config, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Set slot config failed", error);
    throw new Error(extractErrorMessage(error, "Set slot config failed"));
  }
};

export const getSlotConfigs = async () => {
  try {
    const response = await api.get("/company/slots/config", {
      withCredentials: true,
    });
    // Return as array - backend returns single config, wrap in array for consistency
    return response.data ? [response.data] : [];
  } catch (error) {
    console.error("❌ Get slot configs failed", error);
    throw new Error(extractErrorMessage(error, "Get slot configs failed"));
  }
};

export const deleteSlotConfig = async () => {
  try {
    const response = await api.delete("/company/slots/config", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Delete slot config failed", error);
    throw new Error(extractErrorMessage(error, "Delete slot config failed"));
  }
};

export const getCompanyBookings = async () => {
  try {
    const response = await api.get("/company/get-bookings", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get company bookings failed", error);
    throw new Error(extractErrorMessage(error, "Get company bookings failed"));
  }
};

export const getWallet = async () => {
  try {
    const response = await api.get("/company/wallet", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get wallet failed", error);
    throw new Error(extractErrorMessage(error, "Failed to fetch wallet data"));
  }
};

export const rescheduleBooking = async (bookingId: string, newDate: string, newStartTime: string) => {
  try {
    const response = await api.patch(`/company/bookings/${bookingId}/reschedule`, {
      newDate,
      newStartTime
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Reschedule booking failed", error);
    throw new Error(extractErrorMessage(error, "Reschedule booking failed"));
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/company/dashboard/stats", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get dashboard stats failed", error);
    throw new Error(extractErrorMessage(error, "Get dashboard stats failed"));
  }
};
