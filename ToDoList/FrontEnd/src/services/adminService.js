import api from './api';

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/Admin/users');
    return response.data;
  },

  getDeletedUsers: async () => {
    const response = await api.get('/Admin/users/deletedUsers');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/Admin/users/${userId}`);
    return response.data;
  },

  restoreUser: async (userId) => {
    const response = await api.put(`/Admin/users/${userId}/restore`);
    return response.data;
  },
};
