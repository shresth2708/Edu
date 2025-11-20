import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@services/authService'
import toast from 'react-hot-toast'

const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload
      state.user = user
      state.token = accessToken
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', accessToken)
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.accessToken
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.data.user))
        localStorage.setItem('token', action.payload.data.accessToken)
        localStorage.setItem('refreshToken', action.payload.data.refreshToken)
        toast.success('Login successful!')
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || 'Login failed')
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.accessToken
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.data.user))
        localStorage.setItem('token', action.payload.data.accessToken)
        localStorage.setItem('refreshToken', action.payload.data.refreshToken)
        toast.success('Registration successful!')
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || 'Registration failed')
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        toast.success('Logged out successfully')
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        localStorage.clear()
      })

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
        localStorage.setItem('user', JSON.stringify(action.payload.data))
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.clear()
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
