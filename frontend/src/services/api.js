import axios from 'axios';

// Use local backend for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching issues across devices
    config.headers['X-Request-Time'] = new Date().getTime();
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration and sync issues
api.interceptors.response.use(
  (response) => {
    // Add last sync timestamp for cross-device sync tracking
    if (response.data && typeof response.data === 'object') {
      response.data._lastSync = new Date().toISOString();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear all local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastSyncTime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cross-device sync utilities
export const syncUtils = {
  // Get last sync time for this device
  getLastSyncTime: () => {
    return localStorage.getItem('lastSyncTime') || '1970-01-01T00:00:00.000Z';
  },
  
  // Update last sync time
  updateSyncTime: () => {
    localStorage.setItem('lastSyncTime', new Date().toISOString());
  },
  
  // Check if data needs refresh (for cross-device sync)
  needsRefresh: (dataTimestamp) => {
    const lastSync = new Date(syncUtils.getLastSyncTime());
    const dataTime = new Date(dataTimestamp);
    return dataTime > lastSync;
  },
  
  // Force refresh all data (useful when switching devices)
  forceRefresh: async () => {
    try {
      // Clear any cached data
      localStorage.removeItem('lastSyncTime');
      
      // Trigger a full data refresh
      window.dispatchEvent(new CustomEvent('forceDataRefresh'));
      
      return true;
    } catch (error) {
      console.error('Error during force refresh:', error);
      return false;
    }
  }
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const cyclesAPI = {
  createCycle: (data) => {
    syncUtils.updateSyncTime();
    return api.post('/cycles', data);
  },
  getCycles: (forceRefresh = false) => {
    if (forceRefresh) {
      return api.get('/cycles?refresh=true');
    }
    return api.get('/cycles');
  },
  getStats: () => api.get('/cycles/stats'),
  predictNext: () => api.get('/cycles/predict-next'),
  updateCycle: (id, data) => {
    syncUtils.updateSyncTime();
    return api.put(`/cycles/${id}`, data);
  },
  deleteCycle: (id) => {
    syncUtils.updateSyncTime();
    return api.delete(`/cycles/${id}`);
  }
};

export const symptomsAPI = {
  createSymptom: (data) => {
    syncUtils.updateSyncTime();
    return api.post('/symptoms', data);
  },
  logSymptom: (data) => {
    syncUtils.updateSyncTime();
    return api.post('/symptoms', data);
  },
  getSymptoms: (params, forceRefresh = false) => {
    if (forceRefresh) {
      return api.get('/symptoms?refresh=true', { params });
    }
    return api.get('/symptoms', { params });
  },
  getAnalysis: () => api.get('/symptoms/analysis'),
  updateSymptom: (id, data) => {
    syncUtils.updateSyncTime();
    return api.put(`/symptoms/${id}`, data);
  },
  deleteSymptom: (id) => {
    syncUtils.updateSyncTime();
    return api.delete(`/symptoms/${id}`);
  }
};

export const predictionsAPI = {
  assessPCODRisk: (data) => api.post('/predictions/pcod-risk', data),
  autoAssess: () => api.get('/predictions/pcod-risk/auto'),
};

export default api;
