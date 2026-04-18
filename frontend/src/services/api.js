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
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    sendOTP: (email) => api.post('/auth/send-otp', { email }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    getMe: () => api.get('/auth/me'),
};

// Admin User Management
export const adminAPI = {
    getUsers: (params) => api.get('/users', { params }),
    createUser: (data) => api.post('/users', data),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

// Generic User/Lecturer routes
export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    getLecturers: () => api.get('/users/lecturers'),
    updateProfile: (data) => api.put('/users/profile', data),
};

// Modules
export const moduleAPI = {
    getAll: (params) => api.get('/modules', { params }),
    getById: (id) => api.get(`/modules/${id}`),
    create: (data) => api.post('/modules', data),
    update: (id, data) => api.put(`/modules/${id}`, data),
    delete: (id) => api.delete(`/modules/${id}`),
};

// Quizzes
export const quizAPI = {
    getAll: (params) => api.get('/quizzes', { params }),
    getByModule: (moduleId, params) => api.get(`/quizzes/module/${moduleId}`, { params }),
    getById: (id) => api.get(`/quizzes/${id}`),
    getAll: (params) => api.get('/quizzes', { params }),
    create: (data) => api.post('/quizzes', data),
    update: (id, data) => api.put(`/quizzes/${id}`, data),
    delete: (id) => api.delete(`/quizzes/${id}`),
};

// Questions
export const questionAPI = {
    getByQuiz: (quizId) => api.get(`/questions/quiz/${quizId}`),
    create: (data) => api.post('/questions', data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`),
};

// Attempts
export const attemptAPI = {
    start: (quizId) => api.post(`/attempt/start/${quizId}`),
    submit: (quizId, data) => api.post(`/attempt/submit/${quizId}`, data),
};

// Results
export const resultAPI = {
    getAll: (params) => api.get('/results', { params }),
    getStudentResults: (params) => api.get('/results/student', { params }),
    getReport: (quizId) => api.get(`/results/report/${quizId}`),
    getPublicReport: (quizId) => api.get(`/results/quiz/${quizId}/public-report`),
    getHistory: (quizId) => api.get(`/results/history/${quizId}`),
};

// Chatbot
export const chatbotAPI = {
    ask: (message) => api.post('/chatbot/ask', { message }),
    getHistory: () => api.get('/chatbot/history'),
    clearHistory: () => api.delete('/chatbot/history'),
};

// Announcements
export const announcementAPI = {
    create: (data) => api.post('/announcements', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getByModule: (moduleId) => api.get(`/announcements/module/${moduleId}`),
    getForLecturer: () => api.get('/announcements/lecturer'),
    getForStudent: () => api.get('/announcements/student'),
    update: (id, data) => api.put(`/announcements/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/announcements/${id}`),
};

// Tickets
export const ticketAPI = {
    create: (data) => api.post('/tickets', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getForLecturer: () => api.get('/tickets/lecturer'),
    getForStudent: () => api.get('/tickets/student'),
    update: (id, data) => api.put(`/tickets/${id}`, data),
    respond: (id, data) => api.post(`/tickets/${id}/respond`, data),
};


export default api;

