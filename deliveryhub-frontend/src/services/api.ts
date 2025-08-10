import axios from 'axios';
import {
  User,
  Delivery,
  Message,
  Rating,
  PaymentSummary,
  DashboardStats,
  LoginRequest,
  RegisterRequest,
  CreateDeliveryRequest,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
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

export const authAPI = {
  login: async (data: LoginRequest): Promise<string> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export const deliveryAPI = {
  create: async (data: CreateDeliveryRequest): Promise<Delivery> => {
    const response = await api.post('/deliveries', data);
    return response.data;
  },

  getMyDeliveries: async (status?: string): Promise<Delivery[]> => {
    const url = status ? `/deliveries/track?status=${status}` : '/deliveries/track';
    const response = await api.get(url);
    return response.data;
  },

  getAvailableDeliveries: async (): Promise<Delivery[]> => {
    const response = await api.get('/deliveries/available');
    return response.data;
  },

  getAssignedDeliveries: async (): Promise<Delivery[]> => {
    const response = await api.get('/deliveries/assigned');
    return response.data;
  },

  acceptDelivery: async (id: number): Promise<Delivery> => {
    const response = await api.post(`/deliveries/${id}/accept`);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Delivery> => {
    const response = await api.put(`/deliveries/${id}/status`, { status });
    return response.data;
  },

  getById: async (id: number): Promise<Delivery> => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },
};

export const chatAPI = {
  getMessages: async (deliveryId: number, page = 0, size = 50): Promise<Message[]> => {
    const response = await api.get(`/chat/${deliveryId}/messages?page=${page}&size=${size}`);
    return response.data;
  },

  sendMessage: async (deliveryId: number, content: string): Promise<Message> => {
    const response = await api.post(`/chat/${deliveryId}/send`, { content });
    return response.data;
  },

  uploadFile: async (deliveryId: number, file: File): Promise<Message> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/chat/${deliveryId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  markAsRead: async (messageId: number): Promise<void> => {
    await api.put(`/chat/${messageId}/read`);
  },

  downloadFile: async (messageId: number): Promise<Blob> => {
    const response = await api.get(`/chat/${messageId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const paymentAPI = {
  getSummary: async (deliveryId: number): Promise<PaymentSummary> => {
    const response = await api.get(`/payment/${deliveryId}/summary`);
    return response.data;
  },
};

export const ratingAPI = {
  create: async (deliveryId: number, rating: number, feedback?: string): Promise<Rating> => {
    const response = await api.post('/ratings', {
      deliveryId,
      rating,
      feedback,
    });
    return response.data;
  },

  getByDelivery: async (deliveryId: number): Promise<Rating[]> => {
    const response = await api.get(`/ratings/delivery/${deliveryId}`);
    return response.data;
  },

  getByTransporter: async (transporterId: number): Promise<Rating[]> => {
    const response = await api.get(`/ratings/transporter/${transporterId}`);
    return response.data;
  },
};

export const adminAPI = {
  getPendingTransporters: async (): Promise<User[]> => {
    const response = await api.get('/admin/transporters/pending');
    return response.data;
  },

  approveTransporter: async (id: number): Promise<User> => {
    const response = await api.put(`/admin/transporters/${id}/approve`);
    return response.data;
  },

  rejectTransporter: async (id: number): Promise<User> => {
    const response = await api.put(`/admin/transporters/${id}/reject`);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getDeliveryAnalytics: async (timeRange: string = '30d'): Promise<any> => {
    const response = await api.get(`/admin/dashboard/analytics?timeRange=${timeRange}`);
    return response.data;
  },
};

export const userAPI = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  updateTransporterInfo: async (data: any): Promise<User> => {
    const response = await api.put('/users/transporter-info', data);
    return response.data;
  },
};

export default api;