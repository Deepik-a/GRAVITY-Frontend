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

