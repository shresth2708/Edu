import api from './api'

const testService = {
  // Get all tests for a course
  getTestsByCourse: async (courseId) => {
    const response = await api.get('/tests', {
      params: { courseId }
    })
    return response.data
  },

  // Get test details
  getTestById: async (id) => {
    const response = await api.get(`/tests/${id}`)
    return response.data
  },

  // Create test (Teacher)
  createTest: async (testData) => {
    const response = await api.post('/tests', testData)
    return response.data
  },

  // Update test
  updateTest: async (id, testData) => {
    const response = await api.patch(`/tests/${id}`, testData)
    return response.data
  },

  // Submit test
  submitTest: async (testId, answers, timeSpent) => {
    const response = await api.post(`/tests/${testId}/submit`, {
      answers,
      timeSpent
    })
    return response.data
  },

  // Get test submissions
  getTestSubmissions: async (testId) => {
    const response = await api.get(`/tests/${testId}/submissions`)
    return response.data
  },

  // Get my submissions
  getMySubmissions: async () => {
    const response = await api.get('/tests/my-submissions')
    return response.data
  },

  // Get submission by ID
  getSubmissionById: async (submissionId) => {
    const response = await api.get(`/tests/submissions/${submissionId}`)
    return response.data
  },
}

export default testService
