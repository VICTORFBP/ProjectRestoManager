import api from "./axios";

const menuItemsAPI = {
  getAll: () => api.get("/menu-items"),
  getById: (id) => api.get(`/menu-items/${id}`),
  create: (data) => api.post("/menu-items", data),
  update: (id, data) => api.put(`/menu-items/${id}`, data),
  remove: (id) => api.delete(`/menu-items/${id}`),
};

export default menuItemsAPI;
