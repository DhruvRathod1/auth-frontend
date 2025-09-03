export const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://7rtfzr1a2i.execute-api.ap-south-1.amazonaws.com/Dev';

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
