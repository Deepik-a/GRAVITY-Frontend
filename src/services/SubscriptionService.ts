
import api from "./api/useApi";
import { AxiosError } from "axios";
import { CreateSubscriptionPlanDto, SubscriptionPlan } from "@/types/SubscriptionTypes";

const SUBSCRIPTIONS = "/subscriptions";

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    const backendError = err.response?.data?.message || err.response?.data?.error;
    if (typeof backendError === "string") return backendError;
  }
  return fallback;
};

export const createSubscriptionPlan = async (data: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> => {
  try {
    const response = await api.post(`${SUBSCRIPTIONS}/admin/plans`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create subscription plan"));
  }
};

export const getSubscriptionPlans = async (activeOnly = true): Promise<SubscriptionPlan[]> => {
  try {
    const response = await api.get(`${SUBSCRIPTIONS}/plans`, {
      params: { active: activeOnly },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to list subscription plans"));
  }
};

export const createSubscriptionCheckout = async (planId: string, companyId: string): Promise<{ url: string }> => {
  try {
    const response = await api.post(`/payments/create-subscription-checkout`, { planId, companyId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to start subscription checkout"));
  }
}

export const verifySubscriptionSession = async (sessionId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.get(`/payments/verify-session`, {
      params: { sessionId },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to verify payment session"));
  }
}
