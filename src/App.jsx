import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute, { homeForRole } from './components/guards/ProtectedRoute'
import PageWrapper from './components/layout/PageWrapper'
import Login from './pages/auth/Login'
import AcceptInvite from './pages/auth/AcceptInvite'
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'
import ClerkDashboard from './pages/clerk/ClerkDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import SupplyRequests from './pages/admin/SupplyRequests'
import SupplierPayments from './pages/admin/SupplierPayments'
import ClerkManagement from './pages/admin/ClerkManagement'
import MerchantDashboard from './pages/merchant/MerchantDashboard'
import AdminManagement from './pages/merchant/AdminManagement'
import StoreAnalytics from './pages/merchant/StoreAnalytics'
import { useAuth } from './hooks/useAuth'
import './App.css'

function RoleHome() {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={homeForRole(role)} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<PageWrapper />}>
            <Route path="/" element={<RoleHome />} />

            <Route element={<ProtectedRoute roles={['clerk']} />}>
              <Route path="/clerk" element={<ClerkDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/supply-requests" element={<SupplyRequests />} />
              <Route
                path="/admin/supplier-payments"
                element={<SupplierPayments />}
              />
              <Route path="/admin/clerks" element={<ClerkManagement />} />
            </Route>

            <Route element={<ProtectedRoute roles={['merchant']} />}>
              <Route path="/merchant" element={<MerchantDashboard />} />
              <Route path="/merchant/admins" element={<AdminManagement />} />
              <Route path="/merchant/analytics" element={<StoreAnalytics />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
