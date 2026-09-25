import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject active demo persona or Clerk token
api.interceptors.request.use((config) => {
  const currentRole = localStorage.getItem('nyay_demo_role') || 'citizen';
  const currentUserId = localStorage.getItem('nyay_demo_user_id');
  const clerkToken = localStorage.getItem('nyay_clerk_token');

  config.headers['x-demo-role'] = currentRole;
  if (currentUserId) {
    config.headers['x-demo-user-id'] = currentUserId;
  }
  if (clerkToken) {
    config.headers.Authorization = `Bearer ${clerkToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const code = error.response?.data?.code || 'UNKNOWN_ERROR';
    return Promise.reject({ message, code, status: error.response?.status, original: error });
  }
);

export default api;
