
export function extractAxiosError(error: unknown): string {
  if (typeof error === "string") return error;
  
  const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  const backendMessage = err.response?.data?.message || err.response?.data?.error;
  
  if (backendMessage && typeof backendMessage === "string") {
    return backendMessage;
  }

  if (err.message && typeof err.message === "string") {
    return err.message;
  }

  return "An unexpected error occurred.";
}
