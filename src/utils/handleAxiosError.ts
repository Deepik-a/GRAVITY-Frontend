import { AxiosError } from "axios";

export function extractAxiosError(error: unknown): string {
  const err = error as AxiosError<{ error?: string; message?: string }>;
  return (
    err.response?.data?.error ||
    err.response?.data?.message ||
    err.message ||
    "An unexpected error occurred."
  );
}
