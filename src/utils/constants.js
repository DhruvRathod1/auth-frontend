export const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
    HEALTH: '/auth/health',
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKENS: '/auth/refresh-tokens',
    GOOGLE_AUTH: '/auth/google/auth',
    GOOGLE_CALLBACK: '/auth/google/callback'
};