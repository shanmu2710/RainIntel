const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...getHeaders(), ...options.headers };
    
    const response = await fetch(url, { 
      ...options, 
      headers 
    });
    
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || errBody.message || Object.values(errBody)[0] || 'Request failed');
    }
    
    return response.json();
  },

  auth: {
    login(email, password) {
      return api.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register(username, email, password, fullName, roleName = 'FIELD_ENGINEER', districtId = null) {
      return api.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, fullName, roleName, districtId }),
      });
    },
  },

  districts: {
    getAll() {
      return api.request('/api/districts');
    },
  },

  gis: {
    lookup(latitude, longitude) {
      return api.request(`/api/gis/lookup?latitude=${latitude}&longitude=${longitude}`);
    },
  },

  assessments: {
    create(data) {
      return api.request('/api/assessments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    list() {
      return api.request('/api/assessments');
    },
    getDetails(id) {
      return api.request(`/api/assessments/${id}`);
    },
    updateStatus(id, status) {
      return api.request(`/api/assessments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
  },

  analytics: {
    getSummary() {
      return api.request('/api/analytics/summary');
    },
    getDistrictRanking() {
      return api.request('/api/analytics/district-ranking');
    },
  },
};
