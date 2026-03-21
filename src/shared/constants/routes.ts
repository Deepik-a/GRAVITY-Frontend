/**
 * Frontend-to-Backend API Route Constants
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/google",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    PROFILE: "/user/me/profile",
    PROFILE_IMAGE: "/user/me/profile/image",
    PROFILE_FIELD: "/user/me/profile/field",
    PROFILE_PASSWORD: "/user/me/profile/password",
    FAVOURITES: "/user/me/profile/favourites",
    COMPANIES: "/user/companies",
    SLOTS_AVAILABLE: "/user/slots/available",
    SLOTS_CONFIG: "/user/companies/:companyId/slots/config",
    BOOK_SLOT: "/user/slots/book",
    BOOKINGS: "/user/me/bookings",
    BOOKING_COMPLETE: "/user/me/bookings/:bookingId/complete",
    REVIEWS: "/user/reviews",
    COMPANY_REVIEWS: "/user/companies/:companyId/reviews",
    STATS: "/user/stats",
  },
  COMPANY: {
    PROFILE: "/company/me/profile",
    PROFILE_IMAGE: "/company/me/profile/image",
    ME: "/company/me",
    DASHBOARD_STATS: "/company/me/dashboard/stats",
    VERIFICATION: "/company/me/verification",
    SLOTS_CONFIG: "/company/me/slots/config",
    SLOTS: "/company/me/slots",
    BOOKINGS: "/company/me/bookings",
    BOOKING_UPDATE: "/company/me/bookings/:bookingId",
    DASHBOARD: "/company/me/dashboard",
    WALLET: "/company/me/wallet",
  },
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD_STATS: "/admin/dashboard-stats",
    USER_MANAGEMENT: "/admin/usermanagment",
    COMPANY_MANAGEMENT: "/admin/companies",
    TRANSACTIONS: "/admin/transactions",
  },
  PAYMENTS: {
    CREATE_CHECKOUT: "/payments/create-checkout-session",
    VERIFY_SESSION: "/payments/verify-session",
  },
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    MESSAGES: "/chat/messages",
    ATTACHMENTS: "/chat/attachments",
    SEND_MESSAGE: "/chat/send",
  }
};
