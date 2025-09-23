export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  description?: string;
  apiKey: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    feedbacks: number;
  };
}

export interface Feedback {
  id: string;
  projectId: string;
  description: string;
  screenshot?: string;
  metadata: {
    url: string;
    userAgent: string;
    screenResolution: string;
    viewport: string;
    browser?: string;
    os?: string;
  };
  email?: string;
  userAgent?: string;
  url: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  feedbackId: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreateProjectData {
  name: string;
  domain: string;
  description?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}