import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration || 4000;
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  success: (title, message) =>
    useToastStore.getState().addToast({ type: 'success', title, message }),
  error: (title, message) =>
    useToastStore.getState().addToast({ type: 'error', title, message }),
  info: (title, message) =>
    useToastStore.getState().addToast({ type: 'info', title, message }),
  warning: (title, message) =>
    useToastStore.getState().addToast({ type: 'warning', title, message }),
}));

export const toast = {
  success: (title: string, message?: string) => useToastStore.getState().success(title, message),
  error: (title: string, message?: string) => useToastStore.getState().error(title, message),
  info: (title: string, message?: string) => useToastStore.getState().info(title, message),
  warning: (title: string, message?: string) => useToastStore.getState().warning(title, message),
};
