// Frontend Message Constants

export const MESSAGES = {
  // Toast Messages
  TOAST: {
    // Authentication
    LOGIN_SUCCESS: "Login Success",
    LOGIN_EXPIRED: "Login expired",
    UNAUTHORIZED: "Unauthorized access",
    INVALID_TOKEN: "Invalid or expired token",
    COMPANY_PENDING: "Company not verified. Please wait for admin approval",
    ADMIN_LOGIN_SUCCESS: "Admin login successful",
    OTP_SUCCESS: "OTP sent to your registered email.",
    GOOGLE_USER: "This email is registered via Google Sign-In. No password reset required.",
    OTP_RESEND_SUCCESS: "OTP resent successfully. Please check your email.",
    PASSWORD_RESET_SUCCESS: "Password has been reset successfully.",
    OTP_GENERATE_SUCCESS: "OTP generated and sent successfully",
    OTP_VERIFY_SUCCESS: "OTP verified successfully",
    AUTH_FAILED: "Authentication failed",
    ACCOUNT_BLOCKED: "Your account has been blocked. Please contact admin.",
    GOOGLE_USER_LOGIN: "This email is registered via Google Sign-In. No password reset required.",
    NO_PASSWORD: "Password is not available for this account. Please contact administrator or use the forgot password option.",
    LOGOUT_SUCCESS: "Logged out successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCESS_DENIED: "Access Denied. User role not found.",
    ROLE_NOT_FOUND: "Access Denied. Your role is not authorized.",
    EMAIL_REGISTERED_WITH_GOOGLE: "EMAIL_REGISTERED_WITH_GOOGLE",
    EMAIL_ALREADY_IN_USE: "Email already in use",
    EMAIL_REGISTERED_AS_COMPANY: "Email is already registered as company",
    EMAIL_REGISTERED_AS_USER: "Email is already registered as user",

    // User Operations
    PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
    PROFILE_FETCH_SUCCESS: "Profile fetched successfully",
    PROFILE_IMAGE_UPLOAD_SUCCESS: "Profile image uploaded",
    PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
    FAVOURITES_UPDATE_SUCCESS: "Favourites updated",
    FAVOURITES_FETCH_SUCCESS: "Favourites fetched",

    // Company Operations
    DOCUMENTS_REJECTED: "Documents rejected. Please upload again.",
    DOCUMENTS_REQUIRED: "Exactly 3 documents are required",
    UPLOAD_SUCCESS: "Documents uploaded successfully. Await admin approval.",
    COMPANY_PROFILE_UPDATE_SUCCESS: "Company profile updated successfully",
    COMPANY_IMAGE_UPLOAD_SUCCESS: "Profile image uploaded successfully",
    VERIFICATION_PENDING: "Company verification is pending approval by admin. Please wait.",

    // Booking Operations
    SLOT_BOOKED_SUCCESS: "Slot booked successfully",
    BOOKING_COMPLETE_SUCCESS: "Booking completed successfully",
    BOOKING_RESCHEDULE_SUCCESS: "Booking rescheduled successfully",
    BOOKING_NOT_FOUND: "Booking not found",
    SLOT_ALREADY_TAKEN: "This slot has already been taken by someone else.",
    SERVICE_ALREADY_COMPLETED: "Service already marked as completed",
    BOOKING_NOT_PAID: "Cannot complete a booking that hasn't been paid for",

    // Review Operations
    REVIEW_SUBMIT_SUCCESS: "Review submitted successfully",
    REVIEW_FETCH_SUCCESS: "Reviews fetched successfully",
    ALREADY_REVIEWED: "You have already reviewed this company",

    // Generic Operations
    UNKNOWN_ERROR: "Something went wrong",
    BAD_REQUEST: "Invalid request",
    INTERNAL_ERROR: "An unexpected error occurred",
    SERVER_ERROR: "Internal server error",
    WEBHOOK_ERROR: "Webhook Error",
    SESSION_ID_REQUIRED: "Session ID is required",

    // Validation Messages
    FIELD_REQUIRED: "Field name required",
    ID_REQUIRED: "ID is required",
    REQUIRED_FIELDS_MISSING: "Required fields are missing",
    EMAIL_REQUIRED: "Email is required to identify the company",
    INVALID_CATEGORIES: "Invalid categories. Allowed are: Residential, Villas, Commercial",
    INVALID_SERVICES: "Invalid services. Allowed are: Architecture, Interior Design, Renovation"
  },

  // Form Labels
  LABELS: {
    CONSULTATION_FEE: "Consultation fee must be between ₹100 and ₹4000",
    INVALID_PHONE: "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
    INVALID_LOCATION: "Location must contain only alphabets and spaces",
    PROJECT_TITLE_REQUIRED: "Project title is required",
    PROJECT_TITLE_ALPHABETS: "Project title must contain only alphabets and spaces",
    PROJECT_TITLE_LENGTH: "Project title must be at least 3 characters",
    PROJECT_TITLE_MAX_LENGTH: "Project title cannot exceed 100 characters",
    PROJECT_DESCRIPTION_REQUIRED: "Project description is required",
    PROJECT_DESCRIPTION_LENGTH: "Description should be at least 30 characters"
  },

  SERVICE: {
    SIGNUP_FAILED: "Signup failed",
    LOGIN_FAILED: "Login failed",
    ADMIN_LOGIN_FAILED: "Admin login failed",
    FORGOT_PASSWORD_FAILED: "Forgot password failed",
    VERIFY_OTP_FAILED: "Verify OTP failed",
    RESEND_OTP_FAILED: "Resend OTP failed",
    RESET_PASSWORD_FAILED: "Reset password failed",
    GOOGLE_LOGIN_FAILED: "Google login failed",
    SEARCH_DATA_FAILED: "Failed to search data",
    SEARCH_COMPANIES_FAILED: "Failed to search companies",
    FETCH_USERS_FAILED: "Failed to fetch users",
    FETCH_COMPANIES_FAILED: "Failed to fetch companies",
    VERIFY_COMPANY_FAILED: "Failed to verify company",
    UPDATE_USER_BLOCK_STATUS_FAILED: "Failed to update user block status",
    UPDATE_COMPANY_BLOCK_STATUS_FAILED: "Failed to update company block status",
    FETCH_BOOKINGS_FAILED: "Failed to fetch bookings",
    FETCH_REVENUE_STATS_FAILED: "Failed to fetch revenue stats",
    REFUND_BOOKING_FAILED: "Failed to refund booking",
    INITIATE_PAYOUT_FAILED: "Failed to initiate payout",
    FETCH_TRANSACTIONS_FAILED: "Failed to fetch transactions",
    FETCH_DASHBOARD_STATS_FAILED: "Failed to fetch dashboard stats",

    CREATE_SUBSCRIPTION_PLAN_FAILED: "Failed to create subscription plan",
    LIST_SUBSCRIPTION_PLANS_FAILED: "Failed to list subscription plans",
    START_SUBSCRIPTION_CHECKOUT_FAILED: "Failed to start subscription checkout",
    VERIFY_PAYMENT_SESSION_FAILED: "Failed to verify payment session",

    UPLOAD_FAILED: "Upload failed",
    UPLOAD_IMAGE_FAILED: "Upload image failed",
    GET_PROFILE_FAILED: "Get profile failed",
    GET_MY_PROFILE_FAILED: "Get my profile failed",
    SAVE_PROFILE_FAILED: "Save profile failed",
    DELETE_PROFILE_FAILED: "Delete profile failed",
    SET_SLOT_CONFIG_FAILED: "Set slot config failed",
    GET_SLOT_CONFIGS_FAILED: "Get slot configs failed",
    DELETE_SLOT_CONFIG_FAILED: "Delete slot config failed",
    GET_COMPANY_BOOKINGS_FAILED: "Get company bookings failed",
    FETCH_WALLET_FAILED: "Failed to fetch wallet data",
    RESCHEDULE_BOOKING_FAILED: "Reschedule booking failed",
    CANCEL_BOOKING_FAILED: "Cancel booking failed",

    FETCH_PROFILE_FAILED: "Failed to fetch profile",
    UPDATE_PROFILE_FAILED: "Failed to update profile",
    UPLOAD_PROFILE_IMAGE_FAILED: "Failed to upload image",
    DELETE_FIELD_FAILED: "Failed to delete field",
    LOGOUT_FAILED: "Logout failed",
  }
} as const;
