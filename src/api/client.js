const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('ns_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login:   (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me:      ()                => request('/auth/me'),
  logout:  ()                => request('/auth/logout', { method: 'POST' }),

  // Projects
  getProjects:       (params = {}) => request('/projects?' + new URLSearchParams(params)),
  getProject:        (id)          => request(`/projects/${id}`),
  createProject:     (data)        => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject:     (id, data)    => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject:     (id)          => request(`/projects/${id}`, { method: 'DELETE' }),
  getProjectUpdates: (id)          => request(`/projects/${id}/updates`),
  getProjectBlockers:(id)          => request(`/projects/${id}/blockers`),

  // Users
  getUsers:        (params = {}) => request('/users?' + new URLSearchParams(params)),
  getUser:         (id)          => request(`/users/${id}`),
  getUserProjects: (id)          => request(`/users/${id}/projects`),

  // Updates (conversational)
  getUpdates:      (params = {}) => request('/updates?' + new URLSearchParams(params)),
  getUpdate:       (id)          => request(`/updates/${id}`),
  createUpdate:    (data)        => request('/updates', { method: 'POST', body: JSON.stringify(data) }),
  sendMessage:     (id, content) => request(`/updates/${id}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Blockers
  getBlockers:   (params = {}) => request('/blockers?' + new URLSearchParams(params)),
  createBlocker: (data)        => request('/blockers', { method: 'POST', body: JSON.stringify(data) }),
  updateBlocker: (id, data)    => request(`/blockers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Analytics
  getAnalyticsOverview:    () => request('/analytics/overview'),
  getMoraleHistory:        () => request('/analytics/morale'),
  getProjectHealthHistory: () => request('/analytics/project-health'),
  getBlockerDistribution:  () => request('/analytics/blockers'),
  getDepartmentActivity:   () => request('/analytics/department-activity'),
  getWorkload:             () => request('/analytics/workload'),
  getEngagement:           () => request('/analytics/engagement'),
  getRiskScores:           () => request('/analytics/risk-scores'),
  getRecommendations:      () => request('/analytics/recommendations'),
  getAnalyticsRadar:       () => request('/analytics/radar'),
  getRadarData:            () => request('/analytics/radar'),

  // Insights
  getInsights:     (params = {}) => request('/insights?' + new URLSearchParams(params)),
  getActivityFeed: (params = {}) => request('/insights/activity-feed?' + new URLSearchParams(params)),
};
