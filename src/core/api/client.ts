import axios, { AxiosResponse } from 'axios';
import { env } from '../config/env';
import { ApiError } from './api-error';
import { getStoredToken } from '../services/token-storage';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  payload: T;
}

const http = axios.create({
  baseURL: env.apiUrl,
});

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    // The envelope is unwrapped here; callers receive `payload` typed as T
    // via the `api.*` helpers below, even though axios's own types still
    // expect an AxiosResponse at this boundary.
    return envelope.payload as unknown as AxiosResponse;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message =
        (error.response?.data as { message?: string } | undefined)
          ?.message ?? error.message;
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    http.get<T, T>(url, { params }),
  post: <T>(url: string, data?: unknown) => http.post<T, T>(url, data),
  put: <T>(url: string, data?: unknown) => http.put<T, T>(url, data),
  patch: <T>(url: string, data?: unknown) => http.patch<T, T>(url, data),
  delete: <T>(url: string) => http.delete<T, T>(url),
};
