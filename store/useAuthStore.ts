import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  rolesList?: string[];
  avatarUrl?: string;
  phone?: string;
  profile?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ytt_user', JSON.stringify(user));
      localStorage.setItem('ytt_token', token);
    }
    set({ user, token, isHydrated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ytt_user');
      localStorage.removeItem('ytt_token');
    }
    set({ user: null, token: null, isHydrated: true });
  },

  initAuth: () => {
    if (get().isHydrated) return;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('ytt_user');
      const storedToken = localStorage.getItem('ytt_token');
      if (storedUser && storedToken) {
        try {
          set({
            user: JSON.parse(storedUser),
            token: storedToken,
            isHydrated: true,
          });
          return;
        } catch (err) {
          console.error('Failed to parse auth store from localStorage:', err);
        }
      }
    }
    set({ isHydrated: true });
  },
}));
