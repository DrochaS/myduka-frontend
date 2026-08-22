import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import './PageWrapper.css'

export default function PageWrapper() {
  const { role } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />
      <div className="app-shell__body">
        <Sidebar
          role={role}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
