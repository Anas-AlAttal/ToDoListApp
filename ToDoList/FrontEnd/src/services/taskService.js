import api from './api';

export const taskService = {
  getTasks: async (query = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page);
    if (query.pageSize) params.append('pageSize', query.pageSize);
    if (query.search) params.append('search', query.search);
    if (query.isCompleted !== undefined && query.isCompleted !== null) {
      params.append('isCompleted', query.isCompleted);
    }

    const response = await api.get(`/Task/GetTasks?${params.toString()}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/Task/CreateTask', taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/Task/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/Task/${taskId}`);
    return response.data;
  },

  restoreTask: async (taskId) => {
    const response = await api.put(`/Task/Restore/${taskId}`);
    return response.data;
  },

  getDeletedTasks: async (query = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page);
    if (query.pageSize) params.append('pageSize', query.pageSize);
    if (query.search) params.append('search', query.search);
    if (query.isCompleted !== undefined && query.isCompleted !== null) {
      params.append('isCompleted', query.isCompleted);
    }

    const response = await api.get(`/Task/DeletedTasks?${params.toString()}`);
    return response.data;
  },
};
