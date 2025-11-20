import api from './api'

const paymentService = {
  // Create payment order
  createOrder: async (courseId, couponCode = null) => {
    const response = await api.post('/payments/create-order', {
      courseId,
      couponCode
    })
    return response.data
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData)
    return response.data
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    const response = await api.get('/payments/history', { params })
    return response.data
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`)
    return response.data
  },

  // Apply coupon
  applyCoupon: async (courseId, couponCode) => {
    const response = await api.post('/payments/apply-coupon', {
      courseId,
      couponCode
    })
    return response.data
  },
}

export default paymentService
