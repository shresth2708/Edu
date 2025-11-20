import api from './api'

const dashboardService = {
  // Get student dashboard
  getStudentDashboard: async () => {
    const response = await api.get('/dashboard/student')
    return response.data
  },

  // Get teacher dashboard
  getTeacherDashboard: async () => {
    const response = await api.get('/dashboard/teacher')
    return response.data
  },

  // Get admin dashboard
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin')
    return response.data
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
}

export default dashboardService
