import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKENS}`, {
                        refreshToken
                    });

                    const { AccessToken } = response.data;
                    localStorage.setItem('accessToken', AccessToken);

                    originalRequest.headers.Authorization = `Bearer ${AccessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('idToken');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }
            }
        }

        return Promise.reject(error);
    }
);

const authService = {
    signup: async (userData) => {
        try {
            console.log('Signing up user:', userData.email);
            const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
            console.log('Signup response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error.response?.data || error);
            throw error;
        }
    },

    signin: async (credentials) => {
        try {
            console.log('Signing in user:', credentials.email);
            const response = await apiClient.post(API_ENDPOINTS.SIGNIN, credentials);
            console.log('Signin response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Signin error:', error.response?.data || error);
            throw error;
        }
    },

    verifyEmail: async (email, code) => {
        try {
            console.log('Verifying email:', email);
            const response = await apiClient.post(API_ENDPOINTS.VERIFY, { email, code });
            console.log('Verify response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Verify error:', error.response?.data || error);
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            console.log('Requesting password reset for:', email);
            const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
            console.log('Forgot password response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error.response?.data || error);
            throw error;
        }
    },

    resetPassword: async (email, code, newPassword) => {
        try {
            console.log('Resetting password for:', email);
            const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
                email,
                code,
                newPassword
            });
            console.log('Reset password response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error.response?.data || error);
            throw error;
        }
    },

    getGoogleAuthUrl: async () => {
        try {
            console.log('Requesting Google auth URL...');
            const response = await apiClient.get(API_ENDPOINTS.GOOGLE_AUTH);
            console.log('Google auth URL response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Google auth URL error:', error.response?.data || error);
            throw error;
        }
    },

    // REMOVED: processGoogleCallback method - no longer needed
    // The Google callback is handled by redirect, not AJAX

    refreshTokens: async (refreshToken) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKENS, { refreshToken });
            return response.data;
        } catch (error) {
            console.error('Refresh tokens error:', error.response?.data || error);
            throw error;
        }
    }
};

export default authService;