import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiHome, FiBook, FiVideo, FiClipboard, FiTrendingUp,
  FiUser, FiSettings, FiAward, FiUsers, FiDollarSign, FiBarChart
} from 'react-icons/fi'
import { motion } from 'framer-motion'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const studentLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/my-courses', icon: FiBook, label: 'My Courses' },
    { path: '/dashboard/live-classes', icon: FiVideo, label: 'Live Classes' },
    { path: '/dashboard/tests', icon: FiClipboard, label: 'Tests' },
    { path: '/dashboard/leaderboard', icon: FiTrendingUp, label: 'Leaderboard' },
    { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  ]

  const teacherLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/courses', icon: FiBook, label: 'My Courses' },
    { path: '/dashboard/students', icon: FiUsers, label: 'Students' },
    { path: '/dashboard/live-classes', icon: FiVideo, label: 'Live Classes' },
    { path: '/dashboard/tests', icon: FiClipboard, label: 'Tests' },
    { path: '/dashboard/earnings', icon: FiDollarSign, label: 'Earnings' },
    { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  ]

  const adminLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/users', icon: FiUsers, label: 'Users' },
    { path: '/dashboard/courses', icon: FiBook, label: 'Courses' },
    { path: '/dashboard/institutes', icon: FiAward, label: 'Institutes' },
    { path: '/dashboard/payments', icon: FiDollarSign, label: 'Payments' },
    { path: '/dashboard/analytics', icon: FiBarChart, label: 'Analytics' },
    { path: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
  ]

  const links =
    user?.role === 'STUDENT'
      ? studentLinks
      : user?.role === 'TEACHER'
      ? teacherLinks
      : adminLinks

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E+</span>
            </div>
            <span className="text-xl font-bold text-gradient">EduPro+</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
