import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Request interceptor for debugging in development
api.interceptors.request.use((config) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
});

export default api;
