import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sd_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto-logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sd_token');
      localStorage.removeItem('sd_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ---- Auth ----
export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ---- Dashboard ----
export const dashboardApi = {
  getSummary: (farmerId) =>
    api.get('/analytics/dashboard/summary', { params: farmerId ? { farmerId } : {} }),
};

// ---- Farmers ----
export const farmerApi = {
  getAll:    ()       => api.get('/farmers'),
  getById:   (id)     => api.get(`/farmers/${id}`),
  create:    (data)   => api.post('/farmers', data),
  update:    (id, d)  => api.put(`/farmers/${id}`, d),
  delete:    (id)     => api.delete(`/farmers/${id}`),
};

// ---- Cows ----
export const cowApi = {
  getAll:           (params) => api.get('/cows', { params }),
  getById:          (id)     => api.get(`/cows/${id}`),
  getByFarmer:      (fId)    => api.get(`/cows/farmer/${fId}`),
  getByTag:         (tag)    => api.get(`/cows/tag/${tag}`),
  getBreedDist:     (fId)    => api.get(`/cows/breed-distribution/${fId}`),
  create:           (data)   => api.post('/cows', data),
  update:           (id, d)  => api.put(`/cows/${id}`, d),
  updateStatus:     (id, s)  => api.patch(`/cows/${id}/status`, null, { params: { status: s } }),
  delete:           (id)     => api.delete(`/cows/${id}`),
};

// ---- Inventory ----
export const inventoryApi = {
  getBulls:         ()       => api.get('/inventory/bulls'),
  getBullsByBreed:  (breed)  => api.get(`/inventory/bulls/breed/${breed}`),
  createBull:       (data)   => api.post('/inventory/bulls', data),
  getStraws:        ()       => api.get('/inventory/straws'),
  getAvailable:     (breed)  => api.get(`/inventory/straws/available/${breed}`),
  getLowStock:      (thr=5)  => api.get('/inventory/straws/low-stock', { params: { threshold: thr } }),
  addStraw:         (data)   => api.post('/inventory/straws', data),
  restock:          (id, qty)=> api.patch(`/inventory/straws/${id}/restock`, null, { params: { quantity: qty } }),
};

// ---- Bulls & Genetic Sire Recommendation Engine ----
export const bullApi = {
  getAll:           ()       => api.get('/bulls'),
  getById:          (id)     => api.get(`/bulls/${id}`),
  getGeneticProfile:(id)     => api.get(`/bulls/${id}/genetic-profile`),
  getRecommendations:(cowId, a2a2Only=false) =>
    api.get('/bulls/recommend', { params: { cowId, a2a2Only } }),
  getPerformance:   ()       => api.get('/analytics/bull-performance'),
};

// ---- Breeding ----
export const breedingApi = {
  validate:         (data)   => api.post('/breeding/validate', data),
  simulate:         (data)   => api.post('/breeding/simulate', data),
  confirm:          (data)   => api.post('/breeding/confirm', data),
  getCowHistory:    (cowId)  => api.get(`/breeding/cow/${cowId}/history`),
  getAll:           (params) => api.get('/breeding/records', { params }),
  getCalvings:      (days=30)=> api.get('/breeding/upcoming-calvings', { params: { daysAhead: days } }),
  updateOutcome:    (id, o)  => api.patch(`/breeding/${id}/outcome`, null, { params: { outcome: o } }),
};

// ---- Milk Yield ----
export const milkApi = {
  log:              (data)   => api.post('/analytics/milk', data),
  getCowHistory:    (cowId)  => api.get(`/analytics/milk/cow/${cowId}`),
  getTrend:         (cowId, from, to) =>
    api.get(`/analytics/milk/cow/${cowId}/trend`, { params: { from, to } }),
  getBreedComp:     (fId)    => api.get(`/analytics/milk/farmer/${fId}/breed-comparison`),
};

// ---- Notifications ----
export const notifApi = {
  getAll:     (params) => api.get('/notifications', { params }),
  getCount:   ()       => api.get('/notifications/unread-count'),
  markRead:   (id)     => api.patch(`/notifications/${id}/read`),
  markAllRead:()       => api.patch('/notifications/read-all'),
};
