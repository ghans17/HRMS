import api from './api';

const getAll = (params) => {
  return api.get('/api/v1/employees/', { params });
};

const create = (data) => {
  return api.post('/api/v1/employees/', data);
};

const remove = (id) => {
  return api.delete(`/api/v1/employees/${id}`);
};

const update = (id, data) => {
  return api.put(`/api/v1/employees/${id}`, data);
};

const employeeService = {
  getAll,
  create,
  remove,
  update,
};

export default employeeService;
