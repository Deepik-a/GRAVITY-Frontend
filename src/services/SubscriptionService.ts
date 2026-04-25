
import api from "./api/useApi";
import { AxiosError } from "axios";
import { CreateSubscriptionPlanDto, SubscriptionPlan } from "@/types/SubscriptionTypes";
import { API_ROUTES } from "@/shared/constants/AppRoutes";
import { MESSAGES } from "@/shared/constants/Messages";

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
    const response = await api.post(API_ROUTES.SUBSCRIPTIONS.ADMIN_PLANS, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.CREATE_SUBSCRIPTION_PLAN_FAILED));
  }
};

export const getSubscriptionPlans = async (activeOnly = true): Promise<SubscriptionPlan[]> => {
  try {
    const response = await api.get(API_ROUTES.SUBSCRIPTIONS.PLANS, {
      params: { active: activeOnly },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.LIST_SUBSCRIPTION_PLANS_FAILED));
  }
};

export const createSubscriptionCheckout = async (planId: string, companyId: string): Promise<{ url: string }> => {
  try {
    const response = await api.post(API_ROUTES.PAYMENTS.CREATE_SUBSCRIPTION_CHECKOUT, { planId, companyId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.START_SUBSCRIPTION_CHECKOUT_FAILED));
  }
}

export const verifySubscriptionSession = async (sessionId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.get(API_ROUTES.PAYMENTS.VERIFY_SESSION, {
      params: { sessionId },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, MESSAGES.SERVICE.VERIFY_PAYMENT_SESSION_FAILED));
  }
}
