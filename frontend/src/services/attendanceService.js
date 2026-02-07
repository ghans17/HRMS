import api from './api';

const mark = (data) => {
  return api.post('/api/v1/attendance/', data);
};

const getAll = (params) => {
  return api.get('/api/v1/attendance/', { params });
};

const attendanceService = {
  mark,
  getAll,
};

export default attendanceService;
