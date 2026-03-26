import api from './api';

const PublicationService = {
  getAllPublications: (page = 1, limit = 20, filters = {}) => {
    const params = { page, limit, ...filters };
    return api.get('/publications', { params });
  },
  
  getPublicationById: (id) => 
    api.get(`/publications/${id}`),
  
  createPublication: (data) => 
    api.post('/publications', data),
  
  filterPublications: (filters = {}) =>
    api.get('/publications/filter', { params: filters })
};

export default PublicationService;
