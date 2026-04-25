import { PaymentStatus } from "@/shared/enums/PaymentStatus";
// Frontend Status Constants

export const DOCUMENT_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  NOT_SUBMITTED: "not_submitted"
} as const;

export const USER_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified"
} as const;

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled"
} as const;

export const PAYMENT_STATUS = {
  PENDING: PaymentStatus.PENDING,
  PAID: PaymentStatus.PAID,
  FAILED: PaymentStatus.FAILED,
  REFUNDED: PaymentStatus.REFUNDED,
} as const;

export const SERVICE_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed"
} as const;

export const MESSAGE_STATUS = {
  SENT: "sent"
} as const;

export const PROVIDER = {
  LOCAL: "local",
  GOOGLE: "google"
} as const;

// Type definitions for status values
export type DocumentStatusType = typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS];
export type UserStatusType = typeof USER_STATUS[keyof typeof USER_STATUS];
export type BookingStatusType = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type PaymentStatusType = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type ServiceStatusType = typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
export type MessageStatusType = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];
export type ProviderType = typeof PROVIDER[keyof typeof PROVIDER];
