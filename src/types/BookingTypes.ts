export interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  price?: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  serviceStatus: "pending" | "completed";
  isRescheduled?: boolean;
  companyDetails?: {
    name: string;
    logo?: string;
  };
  companyId: string;
  userDetails?: {
    name: string;
    email: string;
    profileImage?: string;
  };
}
