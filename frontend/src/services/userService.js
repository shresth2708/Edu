import api from './api'

const userService = {
  // Get all users (Admin)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/me', userData)
    return response.data
  },

  // Update user (Admin)
  updateUser: async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData)
    return response.data
  },

  // Delete user (Admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default userService
