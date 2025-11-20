import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '@components/dashboard/Sidebar'
import DashboardHeader from '@components/dashboard/DashboardHeader'
import { toggleSidebar } from '@store/slices/uiSlice'

const DashboardLayout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <DashboardHeader onMenuClick={() => dispatch(toggleSidebar())} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
