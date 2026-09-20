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
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('ytt_user')
    ? JSON.parse(localStorage.getItem('ytt_user')!)
    : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('ytt_token') : null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ytt_user', JSON.stringify(user));
      localStorage.setItem('ytt_token', token);
    }
    set({ user, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ytt_user');
      localStorage.removeItem('ytt_token');
    }
    set({ user: null, token: null });
  },
}));
