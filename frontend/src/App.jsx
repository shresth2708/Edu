import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Public pages
import Home from './pages/public/Home'
import Courses from './pages/public/Courses'
import CourseDetail from './pages/public/CourseDetail'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import TestConnection from './pages/TestConnection'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Dashboard pages
import StudentDashboard from './pages/dashboard/student/Dashboard'
import TeacherDashboard from './pages/dashboard/teacher/Dashboard'
import AdminDashboard from './pages/dashboard/admin/Dashboard'

// Protected Route component
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-connection" element={<TestConnection />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Student Dashboard */}
          {user?.role === 'STUDENT' && (
            <>
              <Route index element={<StudentDashboard />} />
              <Route path="my-courses" element={<div>My Courses</div>} />
              <Route path="live-classes" element={<div>Live Classes</div>} />
              <Route path="tests" element={<div>Tests</div>} />
              <Route path="leaderboard" element={<div>Leaderboard</div>} />
              <Route path="profile" element={<div>Profile</div>} />
            </>
          )}

          {/* Teacher Dashboard */}
          {user?.role === 'TEACHER' && (
            <>
              <Route index element={<TeacherDashboard />} />
              <Route path="courses" element={<div>Manage Courses</div>} />
              <Route path="courses/create" element={<div>Create Course</div>} />
              <Route path="students" element={<div>Students</div>} />
              <Route path="live-classes" element={<div>Live Classes</div>} />
              <Route path="tests" element={<div>Tests</div>} />
              <Route path="earnings" element={<div>Earnings</div>} />
              <Route path="profile" element={<div>Profile</div>} />
            </>
          )}

          {/* Admin Dashboard */}
          {user?.role === 'ADMIN' && (
            <>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<div>Manage Users</div>} />
              <Route path="courses" element={<div>Manage Courses</div>} />
              <Route path="institutes" element={<div>Manage Institutes</div>} />
              <Route path="payments" element={<div>Payments</div>} />
              <Route path="analytics" element={<div>Analytics</div>} />
              <Route path="settings" element={<div>Settings</div>} />
            </>
          )}
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
