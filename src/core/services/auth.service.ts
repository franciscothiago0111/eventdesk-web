import { api } from '../api/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'STAFF' | 'ATTENDEE';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthUser>('/auth/register', { name, email, password }),
};
