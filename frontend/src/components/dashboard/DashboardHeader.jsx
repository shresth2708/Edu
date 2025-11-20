import { FiMenu, FiBell, FiSearch } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const DashboardHeader = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 hover:text-primary-600"
          >
            <FiMenu size={24} />
          </button>

          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2 w-96">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-700 hover:text-primary-600 transition">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
