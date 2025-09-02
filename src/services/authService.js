import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add token
        this.api.interceptors.request.use((config) => {
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Token management
    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    removeToken() {
        localStorage.removeItem('authToken');
    }

    // Auth API calls
    async signup(userData) {
        const response = await this.api.post(API_ENDPOINTS.SIGNUP, userData);
        return response.data;
    }

    async signin(credentials) {
        const response = await this.api.post(API_ENDPOINTS.SIGNIN, credentials);
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    }

    async verifyEmail(verificationData) {
        const response = await this.api.post(API_ENDPOINTS.VERIFY, verificationData);
        return response.data;
    }

    async forgotPassword(email) {
        const response = await this.api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
        return response.data;
    }

    async resetPassword(resetData) {
        const response = await this.api.post(API_ENDPOINTS.RESET_PASSWORD, resetData);
        return response.data;
    }

    async refreshTokens() {
        const response = await this.api.post(API_ENDPOINTS.REFRESH_TOKENS);
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    }

    async getGoogleAuthUrl() {
        const response = await this.api.get(API_ENDPOINTS.GOOGLE_AUTH);
        return response.data;
    }

    async healthCheck() {
        const response = await this.api.get(API_ENDPOINTS.HEALTH);
        return response.data;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    logout() {
        this.removeToken();
    }
}

const authService = new AuthService();
export default authService;