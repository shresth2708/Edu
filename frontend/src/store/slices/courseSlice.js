import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import courseService from '@services/courseService'

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
}

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourses(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchCourseBySlug = createAsyncThunk(
  'courses/fetchCourseBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseBySlug(slug)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload.data
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload.data
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentCourse } = courseSlice.actions
export default courseSlice.reducer
