import api from "./axios";

const ordersAPI = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  remove: (id) => api.delete(`/orders/${id}`),
};

export default ordersAPI;
