import { useAuthStore } from '../store/useAuthStore';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '')
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://time-trade-backend.onrender.com/api/v1';

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) => fetcher('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  registerAdmin: (body: any) => fetcher('/auth/admin/register', { method: 'POST', body: JSON.stringify(body) }),
  getAdminRegistrationStatus: () => fetcher('/auth/admin/status'),
  login: (body: any) => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getCurrentUser: () => fetcher('/auth/me'),

  // Tasks
  getTodayTasks: (date?: string) => fetcher(`/tasks/today${date ? `?date=${date}` : ''}`),
  toggleTask: (taskId: string, dateStr?: string) =>
    fetcher('/tasks/toggle', { method: 'POST', body: JSON.stringify({ taskId, completionDate: dateStr }) }),
  createTask: (task: any) => fetcher('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: string, task: any) => fetcher(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  deleteTask: (id: string) => fetcher(`/tasks/${id}`, { method: 'DELETE' }),

  // Progress
  getProgress: () => fetcher('/progress'),

  // Follow-Up
  getAssignedParticipants: () => fetcher('/followup/assigned'),
  addFollowUpNote: (participantId: string, noteContent: string) =>
    fetcher('/followup/notes', { method: 'POST', body: JSON.stringify({ participantId, noteContent }) }),

  // Leaderboard
  getLeaderboard: () => fetcher('/leaderboard'),

  // Calendar
  getCalendarEvents: () => fetcher('/calendar'),

  // Calendar & Programme Architecture
  getCurrentProgramme: () => fetcher('/programme/current'),
  getDayDetails: (day?: number, date?: string) => {
    const params = new URLSearchParams();
    if (day) params.append('day', day.toString());
    if (date) params.append('date', date);
    const q = params.toString();
    return fetcher(`/programme/day${q ? `?${q}` : ''}`);
  },
  getCalendarOverview: () => fetcher('/programme/calendar'),
  addPersonalTask: (body: { title: string; category?: string; durationMinutes?: number }) =>
    fetcher('/programme/personal-task', { method: 'POST', body: JSON.stringify(body) }),
  deletePersonalTask: (id: string) => fetcher(`/programme/personal-task/${id}`, { method: 'DELETE' }),

  // Admin CMS & Templates
  getAdminProgrammeTree: () => fetcher('/programme/admin/tree'),
  saveTaskTemplate: (template: any) => fetcher('/programme/admin/template', { method: 'POST', body: JSON.stringify(template) }),
  saveResource: (resource: any) => fetcher('/programme/admin/resource', { method: 'POST', body: JSON.stringify(resource) }),
  assignTaskToDay: (task: any) => fetcher('/programme/admin/assign-task', { method: 'POST', body: JSON.stringify(task) }),

  // Testimonials
  getPublicTestimonials: () => fetcher('/testimonials'),
  submitTestimonial: (content: string, isPublic = true) =>
    fetcher('/testimonials', { method: 'POST', body: JSON.stringify({ content, isPublic }) }),

  // Admin
  getAdminOverview: () => fetcher('/admin/overview'),
  getAllParticipants: () => fetcher('/admin/participants'),
  updateUserRoles: (id: string, body: { roles: string[]; fullName?: string; phone?: string }) =>
    fetcher(`/admin/users/${id}/roles`, { method: 'PUT', body: JSON.stringify(body) }),
  assignFollowUp: (followUpId: string, participantId: string) =>
    fetcher('/admin/assign-followup', { method: 'POST', body: JSON.stringify({ followUpId, participantId }) }),
  getPendingTestimonials: () => fetcher('/admin/testimonials/pending'),
  approveTestimonial: (id: string) => fetcher(`/admin/testimonials/${id}/approve`, { method: 'PUT' }),
  getDynamicFormFields: () => fetcher('/admin/forms/fields'),
  createDynamicFormField: (field: any) => fetcher('/admin/forms/fields', { method: 'POST', body: JSON.stringify(field) }),
  updateDynamicFormField: (id: string, field: any) => fetcher(`/admin/forms/fields/${id}`, { method: 'PUT', body: JSON.stringify(field) }),
  deleteDynamicFormField: (id: string) => fetcher(`/admin/forms/fields/${id}`, { method: 'DELETE' }),
  reorderDynamicFormFields: (fieldOrders: { id: string; displayOrder: number }[]) =>
    fetcher('/admin/forms/fields/reorder', { method: 'PUT', body: JSON.stringify({ fieldOrders }) }),
  updateSettings: (settings: { isAdminRegistrationActive: boolean }) =>
    fetcher('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
};
