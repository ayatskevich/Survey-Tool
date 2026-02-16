import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponseDto, ErrorResponse } from '@/types';

let authInstance: AxiosInstance | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onFailed: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error);
    } else if (token) {
      prom.onSuccess(token);
    }
  });
  failedQueue = [];
};

export const createApiInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add token
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor to handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((onSuccess, onFailed) => {
            failedQueue.push({ onSuccess, onFailed });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(error);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${baseURL}/api/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data as AuthResponseDto;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            processQueue(null, accessToken);
            return instance(originalRequest);
          } catch (err) {
            processQueue(err as Error, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          isRefreshing = false;
          return Promise.reject(error);
        }
      }

      const errorResponse = error.response?.data as ErrorResponse;
      return Promise.reject(
        new Error(
          errorResponse?.error ||
            error.message ||
            'An error occurred'
        )
      );
    }
  );

  return instance;
};

export const getApiInstance = (): AxiosInstance => {
  if (!authInstance) {
    authInstance = createApiInstance();
  }
  return authInstance;
};

export const api = getApiInstance();
