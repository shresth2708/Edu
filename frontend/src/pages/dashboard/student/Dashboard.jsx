import { FiBook, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi'

const StudentDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FiBook className="text-primary-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">+2 this week</span>
          </div>
          <p className="text-3xl font-bold mb-1">12</p>
          <p className="text-gray-600">Enrolled Courses</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-yellow-600" size={24} />
            </div>
            <span className="text-sm text-green-600 font-medium">↑ 15%</span>
          </div>
          <p className="text-3xl font-bold mb-1">2,450</p>
          <p className="text-gray-600">Total XP</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiAward className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-gray-600">Badges Earned</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiClock className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">7</p>
          <p className="text-gray-600">Day Streak 🔥</p>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=100"
              alt="Course"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Advanced Mathematics</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm text-gray-600">65%</span>
              </div>
              <p className="text-sm text-gray-500">Last accessed: 2 hours ago</p>
            </div>
            <button className="btn-primary">Continue</button>
          </div>
        </div>
      </div>

      {/* Upcoming Live Classes */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upcoming Live Classes</h2>
        <p className="text-gray-500">No upcoming classes scheduled</p>
      </div>
    </div>
  )
}

export default StudentDashboard
