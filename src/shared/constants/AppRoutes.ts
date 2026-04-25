// Frontend Route Constants

export const ROUTES = {
  // Public Routes
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/Login",
  OTP: "/otp",
  FORGOT_PASSWORD: "/ForgotPassword",
  RESET_PASSWORD: "/ResetPassword",
  VIDEO_CALL: "/VideoCall",
  UNAUTHORIZED: "/unauthorized",

  // User Routes
  USER: {
    HOME_PAGE: "/User/HomePage",
    COMPANY_PAGE: "/User/CompanyPage",
    BOOK_SLOTS: "/User/BookSlots",
    COMPANY_LISTING: "/User/CompanyListing",
    USER_PROFILE: "/User/UserProfile",
    PAYMENT_SUCCESS: "/User/payment-success",
    PAYMENT_FAILURE: "/User/payment-failure",
  },

  // Company Routes
  COMPANY: {
    DASHBOARD: "/Company/CompanyDashBoard",
    DETAIL: "/Company/CompanyDetail",
    PROFILE: "/Company/CompanyProfile",
    VERIFICATION_PAGE: "/Company/VerificationPage",
    SLOT_MANAGEMENT: "/Company/SlotManagment",
    BOOKINGS: "/Company/Bookings",
    WALLET: "/Company/Wallet",
    MESSAGES: "/Company/Messages",
    REVIEWS: "/Company/Reviews",
    SUBSCRIPTION: "/Company/Subscription",
    PAYMENT_SUCCESS: "/Company/payment-success",
    PAYMENT_FAILURE: "/Company/payment-failure",
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/Admin/AdminDashBoard",
    USERS: "/Admin/UserManagment",
    COMPANIES: "/Admin/CompanyManagment",
    BOOKINGS: "/Admin/Bookings",
    CHAT: "/Admin/Chat",
    FINANCE: "/Admin/Finance",
    REVENUE: "/Admin/Revenue",
    SUBSCRIPTION_MANAGEMENT: "/Admin/SubscriptionManagement",
    SUBSCRIPTIONS: "/Admin/Subscriptions",
  },

  // Query Parameters
  QUERIES: {
    ROLE: "role",
    EMAIL: "email",
    NEXT: "next",
    SHOW: "show",
    VERIFIED: "verified",
    USER_TYPE: "userType",
    ACTION: "action",
    Q: "q",
    PAGE: "page",
    LIMIT: "limit",
    STATUS: "status",
    TYPE: "type",
    USER_ID: "userId",
    COMPANY_ID: "companyId",
    START_DATE: "startDate",
    END_DATE: "endDate",
    CATEGORY: "category",
    SERVICES: "services",
    MIN_PRICE: "minPrice",
    MAX_PRICE: "maxPrice",
    MIN_EXPERIENCE: "minExperience",
    SORT_BY: "sortBy",
    SORT_ORDER: "sortOrder",
    BOOKING_ID: "bookingId",
    SESSION_ID: "sessionId"
  }
} as const;

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
    USERS_SEARCH: "/admin/users-search",
    COMPANY_MANAGEMENT: "/admin/companies",
    COMPANIES_SEARCH: "/admin/companies-search",
    COMPANY_VERIFY: "/admin/companies/:companyId/verify",
    USER_BLOCK: "/admin/users/:userId/block",
    COMPANY_BLOCK: "/admin/companies/:companyId/block",
    BOOKINGS: "/admin/bookings",
    BOOKING_REFUND: "/admin/bookings/:bookingId/refund",
    BOOKING_PAYOUT: "/admin/bookings/:bookingId/payout",
    REVENUE: "/admin/revenue",
    TRANSACTIONS: "/admin/transactions",
  },
  PAYMENTS: {
    CREATE_CHECKOUT: "/payments/create-checkout-session",
    VERIFY_SESSION: "/payments/verify-session",
    CREATE_SUBSCRIPTION_CHECKOUT: "/payments/create-subscription-checkout",
  },
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    MESSAGES: "/chat/messages",
    ATTACHMENTS: "/chat/attachments",
    SEND_MESSAGE: "/chat/send",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    READ_ALL: "/notifications/read-all",
    READ_BY_ID: "/notifications/:notificationId/read",
  },
  SUBSCRIPTIONS: {
    BASE: "/subscriptions",
    PLANS: "/subscriptions/plans",
    ADMIN_PLANS: "/subscriptions/admin/plans",
  },
} as const;

// Helper function to build URLs with query parameters
export const buildUrl = (baseRoute: string, params: Record<string, string | number | boolean | null> = {}): string => {
  const url = new URL(baseRoute, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  
  return url.toString();
};

// Helper function to get verification page URL
export const getVerificationPageUrl = (email: string, role: string): string => {
  return buildUrl(ROUTES.COMPANY.VERIFICATION_PAGE, {
    [ROUTES.QUERIES.ROLE]: role,
    [ROUTES.QUERIES.EMAIL]: email
  });
};
