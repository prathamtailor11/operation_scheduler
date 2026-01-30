/**
 * API Client for Hospital Operation Scheduler
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - Backend may not be running');
        } else if (error.message === 'Network Error' || !error.response) {
            console.error('Network error - Cannot connect to backend API');
            error.userMessage = 'Cannot connect to the server. Please ensure the backend is running on port 5000.';
        } else {
            error.userMessage = error.response?.data?.error || 'An error occurred';
        }
        return Promise.reject(error);
    }
);

// Operations API
export const operationsAPI = {
    getAll: (filters = {}) => api.get('/operations', { params: filters }),
    getById: (id) => api.get(`/operations/${id}`),
    create: (data) => api.post('/operations', data),
    update: (id, data) => api.put(`/operations/${id}`, data),
    updateStatus: (id, status) => api.patch(`/operations/${id}/status`, { status }),
    delete: (id) => api.delete(`/operations/${id}`),
    checkAvailability: (params) => api.get('/operations/availability/check', { params }),
};

// Patients API
export const patientsAPI = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`),
};

// Doctors API
export const doctorsAPI = {
    getAll: (filters = {}) => api.get('/doctors', { params: filters }),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (data) => api.post('/doctors', data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`),
};

// Operation Theaters API
export const operationTheatersAPI = {
    getAll: (filters = {}) => api.get('/operation-theaters', { params: filters }),
    getById: (id) => api.get(`/operation-theaters/${id}`),
    getUtilization: (id, params = {}) => api.get(`/operation-theaters/${id}/utilization`, { params }),
    create: (data) => api.post('/operation-theaters', data),
    update: (id, data) => api.put(`/operation-theaters/${id}`, data),
    delete: (id) => api.delete(`/operation-theaters/${id}`),
};

// Database Viewer API
export const databaseAPI = {
    getView: () => api.get('/database/view'),
    getStats: () => api.get('/database/stats'),
};

export default api;

