import api from './api'

const courseService = {
  // Get all courses (public or authenticated)
  getAllCourses: async (params = {}) => {
    const response = await api.get('/courses', { params })
    return response.data
  },

  // Get single course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  // Create new course (Teacher only)
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData)
    return response.data
  },

  // Update course (Teacher/Admin)
  updateCourse: async (id, courseData) => {
    const response = await api.patch(`/courses/${id}`, courseData)
    return response.data
  },

  // Delete course (Teacher/Admin)
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },

  // Get courses by teacher
  getTeacherCourses: async () => {
    const response = await api.get('/courses/my-courses')
    return response.data
  },

  // Get course sections and lessons
  getCourseSections: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/sections`)
    return response.data
  },
}

export default courseService
