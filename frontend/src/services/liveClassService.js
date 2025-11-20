import api from './api'

const liveClassService = {
  // Get all live classes
  getLiveClasses: async (params = {}) => {
    const response = await api.get('/live-classes', { params })
    return response.data
  },

  // Get live class by ID
  getLiveClassById: async (id) => {
    const response = await api.get(`/live-classes/${id}`)
    return response.data
  },

  // Schedule live class (Teacher)
  scheduleLiveClass: async (classData) => {
    const response = await api.post('/live-classes', classData)
    return response.data
  },

  // Update live class
  updateLiveClass: async (id, classData) => {
    const response = await api.patch(`/live-classes/${id}`, classData)
    return response.data
  },

  // Join live class
  joinLiveClass: async (id) => {
    const response = await api.post(`/live-classes/${id}/join`)
    return response.data
  },

  // Get upcoming classes
  getUpcomingClasses: async () => {
    const response = await api.get('/live-classes', {
      params: { status: 'upcoming' }
    })
    return response.data
  },

  // Record attendance
  recordAttendance: async (classId) => {
    const response = await api.post(`/live-classes/${classId}/attendance`)
    return response.data
  },
}

export default liveClassService
