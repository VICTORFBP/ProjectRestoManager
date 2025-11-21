import api from "./axios";

const tablesAPI = {
  getAll: () => api.get("/tables"),
  getById: (id) => api.get(`/tables/${id}`),
  create: (data) => api.post("/tables", data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  remove: (id) => api.delete(`/tables/${id}`),
};

export default tablesAPI;
