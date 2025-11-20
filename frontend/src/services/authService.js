import api from './api'

const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  login: async (credentials) => {
    return await api.post('/auth/login', credentials)
  },

  logout: async () => {
    return await api.post('/auth/logout')
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me')
  },

  verifyEmail: async (otp) => {
    return await api.post('/auth/verify-email', { otp })
  },

  resendOTP: async () => {
    return await api.post('/auth/resend-otp')
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (data) => {
    return await api.post('/auth/reset-password', data)
  },

  changePassword: async (data) => {
    return await api.post('/auth/change-password', data)
  },
}

export default authService
