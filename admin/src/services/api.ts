import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth';
import { 
  LoginData, 
  RegisterData, 
  CreateProjectData, 
  Project, 
  Feedback, 
  ApiResponse 
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    // Axios v1 headers is AxiosHeaders with helper methods
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginData): Promise<ApiResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const projectAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

export const feedbackAPI = {
  getByProject: async (projectId: string, params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    feedbacks: Feedback[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get(`/feedbacks/project/${projectId}`, { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Feedback> => {
    const response = await api.get(`/feedbacks/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string): Promise<Feedback> => {
    const response = await api.patch(`/feedbacks/${id}/status`, { status });
    return response.data.data;
  },

  addComment: async (feedbackId: string, text: string, author: string): Promise<void> => {
    await api.post(`/feedbacks/${feedbackId}/comments`, { text, author });
  },
};

export default api;