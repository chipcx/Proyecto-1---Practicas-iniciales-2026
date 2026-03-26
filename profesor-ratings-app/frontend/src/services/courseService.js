import api from './api';

const courseService = {

  getApprovedCourses: async (userId) => {
    const res = await api.get(`/approved-courses/${userId}`);
    return res.data;
  },

  addApprovedCourse: async (userId, data) => {
    const res = await api.post(`/approved-courses/${userId}`, data);
    return res.data;
  },

  deleteApprovedCourse: async (userId, courseId) => {
    const res = await api.delete(`/approved-courses/${userId}/${courseId}`);
    return res.data;
  },

  getAllCourses: async () => {
    const res = await api.get(`/courses`);
    return res.data;
  }

};

export default courseService;