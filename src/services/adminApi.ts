import axios, { type AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/api/v1/auth/login", { email, password }),

  logout: () => apiClient.post("/api/v1/logout"),
};


// TODO for refactoring

export const adminUserAPI = {
  listUsers: () => apiClient.get("/admin/api/v1/users"),

  getUserById: (id: number) => apiClient.get(`/admin/api/v1/users/${id}`),

  updateUserById: (id: number, data: Record<string, unknown>) =>
    apiClient.patch(`/admin/api/v1/users/${id}`, data),

  deleteUser: (id: number) => apiClient.delete(`/admin/api/v1/users/${id}`),
};


export const adminSubscriptionAPI = {
  getAllSubscriptions: () =>
    apiClient.get("/admin/api/v1/subscriptions"),

  getSubscriptionsByUserId: (userId: number) =>
    apiClient.get(`/admin/api/v1/subscriptions/${userId}`),

  getSubscriptionById: (id: number) =>
    apiClient.get(`/admin/api/v1/subscription/${id}`),

  getSubscriptionByUserIdAndSubId: (userId: number, subscriptionId: number) =>
    apiClient.get(`/admin/api/v1/users/${userId}/subscriptions/${subscriptionId}`),
};


export const adminNewsfeedAPI = {
  createNewsFeed: (data: Record<string, unknown>) =>
    apiClient.post("/admin/api/v1/newsfeed", data),

  getAllNewsFeed: () => apiClient.get("/admin/api/v1/newsfeed"),

  getNewsFeedById: (id: number) => apiClient.get(`/admin/api/v1/newsfeed/${id}`),

  updateNewsFeed: (id: number, data: Record<string, unknown>) =>
    apiClient.patch(`/admin/api/v1/newsfeed/${id}`, data),

  deleteNewsFeed: (id: number) =>
    apiClient.delete(`/admin/api/v1/newsfeed/${id}`),
};


export const adminTicketAPI = {
  getAllTickets: () => apiClient.get("/admin/api/v1/tickets"),

  getTicketsByUserId: (userId: number) =>
    apiClient.get(`/admin/api/v1/tickets/${userId}`),

  getTicketById: (id: number) =>
    apiClient.get(`/admin/api/v1/ticket/${id}`),

  getTicketByUserIdAndTicketId: (userId: number, ticketId: number) =>
    apiClient.get(`/admin/api/v1/users/${userId}/tickets/${ticketId}`),

  replyToTicket: (id: number, message: string) =>
    apiClient.post(`/admin/api/v1/tickets/${id}/reply`, { message }),

  updateTicketStatus: (id: number, status: string) =>
    apiClient.put(`/admin/api/v1/tickets/${id}/status`, { status }),
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "An error occurred";
  }
  return "An unexpected error occurred";
};
