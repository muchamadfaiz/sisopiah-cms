const URLS = Object.freeze({
  LOGIN: `/api/v1/auth/login`,
  REGISTER: `/auth/register`,
  STORE_GOOGLE_ACCOUNT: `/user/auth-google`,
  ACTIVATION: `/send-activation`,
  RESET_PASSWORD: `user/reset-password`,
  RESEND_ACTIVATION: `user/resend-activation`,
  PROFILE: `/users`,
  USER: "/users",
  CONTENT: "/content",
  WAJIB: "/wajib-pajak",
  VENDOR: "/vendor",
  PROJECT: "/project",
  CATEGORY: "/category",
  CATEGORIZATION: "/categorization",
  TAG: "/tag",
  SUBCATEGORY: "/sub_categories",
  STUDENT:"/students"
});

export default URLS;
