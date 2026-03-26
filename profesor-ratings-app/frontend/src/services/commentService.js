import api from './api';

const CommentService = {
  createComment: (data) => 
    api.post('/comments', data),
  
  deleteComment: (id) => 
    api.delete(`/comments/${id}`)
};

export default CommentService;
