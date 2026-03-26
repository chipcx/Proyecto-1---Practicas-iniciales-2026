import api from './api';

const PublicationService = {
  getAllPublications: (page = 1, limit = 20) => 
    api.get(`/publications?page=${page}&limit=${limit}`),
  
  getPublicationById: (id) => 
    api.get(`/publications/${id}`),
  
  createPublication: (data) => 
    api.post('/publications', data),
  
  filterPublications: (tipo, referencia_id) => 
    api.get('/publications/filter', { 
      params: { tipo, referencia_id } 
    })
};

export default PublicationService;
