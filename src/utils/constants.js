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

// Debug logging
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('Full API URLs:', {
    signup: `${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`,
    signin: `${API_BASE_URL}${API_ENDPOINTS.SIGNIN}`,
    googleAuth: `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_AUTH}`,
    googleCallback: `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_CALLBACK}`
});