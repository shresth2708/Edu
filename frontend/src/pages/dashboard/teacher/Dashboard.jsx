import { FiDollarSign, FiUsers, FiBook, FiTrendingUp } from 'react-icons/fi'

const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+12% this month</span>
          </div>
          <p className="text-3xl font-bold mb-1">₹45,250</p>
          <p className="text-gray-600">Total Earnings</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+18 new</span>
          </div>
          <p className="text-3xl font-bold mb-1">342</p>
          <p className="text-gray-600">Total Students</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiBook className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-gray-600">Active Courses</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">4.8</p>
          <p className="text-gray-600">Avg. Rating</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold mb-2">Create New Course</h3>
          <p className="text-sm text-gray-600">Start building your next course</p>
        </button>
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold mb-2">Schedule Live Class</h3>
          <p className="text-sm text-gray-600">Set up a live session</p>
        </button>
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold mb-2">Create Test</h3>
          <p className="text-sm text-gray-600">Add a new assessment</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity</p>
      </div>
    </div>
  )
}

export default TeacherDashboard
