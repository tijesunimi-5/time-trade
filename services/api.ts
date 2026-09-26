import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../store/useToastStore';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '')
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://time-trade-backend.onrender.com/api/v1';

interface FetcherOptions extends RequestInit {
  suppressErrorToast?: boolean;
}

async function fetcher(endpoint: string, options: FetcherOptions = {}) {
  const token = useAuthStore.getState().token;
  const { suppressErrorToast, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error || 'API Request Failed';
      if (!suppressErrorToast) {
        toast.error('Connection Error', errorMsg);
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: any) {
    if (!suppressErrorToast && (!err.message || err.message.includes('fetch'))) {
      toast.error('Network Failure', 'Unable to connect to Time Trade backend server.');
    }
    throw err;
  }
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
  getPublicResources: () => fetcher('/programme/resources'),
  addPersonalTask: (body: { title: string; category?: string; durationMinutes?: number }) =>
    fetcher('/programme/personal-task', { method: 'POST', body: JSON.stringify(body) }),
  deletePersonalTask: (id: string) => fetcher(`/programme/personal-task/${id}`, { method: 'DELETE' }),

  // Admin CMS & Templates
  getAdminProgrammeTree: () => fetcher('/programme/admin/tree'),
  savePhase: (phase: any) => fetcher('/programme/admin/phase', { method: 'POST', body: JSON.stringify(phase) }),
  deletePhase: (id: string) => fetcher(`/programme/admin/phase/${id}`, { method: 'DELETE' }),
  saveWeek: (week: any) => fetcher('/programme/admin/week', { method: 'POST', body: JSON.stringify(week) }),
  deleteWeek: (id: string) => fetcher(`/programme/admin/week/${id}`, { method: 'DELETE' }),
  saveDay: (day: any) => fetcher('/programme/admin/day', { method: 'POST', body: JSON.stringify(day) }),
  deleteDay: (id: string) => fetcher(`/programme/admin/day/${id}`, { method: 'DELETE' }),
  saveTaskTemplate: (template: any) => fetcher('/programme/admin/template', { method: 'POST', body: JSON.stringify(template) }),
  deleteTaskTemplate: (id: string) => fetcher(`/programme/admin/template/${id}`, { method: 'DELETE' }),
  saveResource: (resource: any) => fetcher('/programme/admin/resource', { method: 'POST', body: JSON.stringify(resource) }),
  deleteResource: (id: string) => fetcher(`/programme/admin/resource/${id}`, { method: 'DELETE' }),
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
  getAllForms: () => fetcher('/admin/forms'),
  saveForm: (form: any) => fetcher('/admin/forms/save', { method: 'POST', body: JSON.stringify(form) }),
  publishForm: (id: string) => fetcher(`/admin/forms/${id}/publish`, { method: 'POST' }),
  unpublishForm: (id: string) => fetcher(`/admin/forms/${id}/unpublish`, { method: 'POST' }),
  deleteForm: (id: string) => fetcher(`/admin/forms/${id}`, { method: 'DELETE' }),
  createDynamicFormField: (field: any) => fetcher('/admin/forms/fields', { method: 'POST', body: JSON.stringify(field) }),
  updateDynamicFormField: (id: string, field: any) => fetcher(`/admin/forms/fields/${id}`, { method: 'PUT', body: JSON.stringify(field) }),
  deleteDynamicFormField: (id: string) => fetcher(`/admin/forms/fields/${id}`, { method: 'DELETE' }),
  reorderDynamicFormFields: (fieldOrders: { id: string; displayOrder: number }[]) =>
    fetcher('/admin/forms/fields/reorder', { method: 'PUT', body: JSON.stringify({ fieldOrders }) }),
  updateSettings: (settings: { isAdminRegistrationActive: boolean }) =>
    fetcher('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
};
