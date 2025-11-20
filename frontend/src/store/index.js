import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import courseReducer from './slices/courseSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
