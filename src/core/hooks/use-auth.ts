import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, AuthUser } from '../services/auth.service';
import {
  clearStoredToken,
  setStoredToken,
} from '../services/token-storage';

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        const { accessToken, user } = await authService.login(
          email,
          password,
        );
        setStoredToken(accessToken);
        set({ user });
      },
      logout: () => {
        clearStoredToken();
        set({ user: null });
      },
    }),
    { name: 'eventdesk.auth' },
  ),
);
