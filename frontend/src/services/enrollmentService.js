import api from './api'

const enrollmentService = {
  // Enroll in a course
  enrollInCourse: async (courseId, paymentId = null) => {
    const response = await api.post('/enrollments', { courseId, paymentId })
    return response.data
  },

  // Get my enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses')
    return response.data
  },

  // Get enrollment details
  getEnrollmentById: async (enrollmentId) => {
    const response = await api.get(`/enrollments/${enrollmentId}`)
    return response.data
  },

  // Update lesson progress
  updateLessonProgress: async (enrollmentId, lessonId, data) => {
    const response = await api.post(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      ...data
    })
    return response.data
  },

  // Get course progress
  getCourseProgress: async (enrollmentId) => {
    const response = await api.get(`/enrollments/${enrollmentId}/progress`)
    return response.data
  },
}

export default enrollmentService
