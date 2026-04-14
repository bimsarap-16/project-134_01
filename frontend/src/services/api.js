import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto logout if unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs only
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (name, email, password, role, otp) =>
        api.post('/auth/register', { name, email, password, role, otp }),

    sendOTP: (email) =>
        api.post('/auth/send-otp', { email }),

    getMe: () =>
        api.get('/auth/me'),
};

export default api;