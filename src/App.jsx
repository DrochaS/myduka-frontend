import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute, { homeForRole } from './components/guards/ProtectedRoute'
import PageWrapper from './components/layout/PageWrapper'
import Loader from './components/common/Loader'
import { useAuth } from './hooks/useAuth'
import './App.css'

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const AcceptInvite = lazy(() => import('./pages/auth/AcceptInvite'))
const NotFound = lazy(() => import('./pages/errors/NotFound'))
const Unauthorized = lazy(() => import('./pages/errors/Unauthorized'))
const ClerkDashboard = lazy(() => import('./pages/clerk/ClerkDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const StockEntries = lazy(() => import('./pages/admin/StockEntries'))
const SupplyRequests = lazy(() => import('./pages/admin/SupplyRequests'))
const SupplierPayments = lazy(() => import('./pages/admin/SupplierPayments'))
const ClerkManagement = lazy(() => import('./pages/admin/ClerkManagement'))
const Alerts = lazy(() => import('./pages/admin/Alerts'))
const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard'))
const StoreAnalytics = lazy(() => import('./pages/merchant/StoreAnalytics'))
const Branches = lazy(() => import('./pages/merchant/Branches'))
const AdminManagement = lazy(() => import('./pages/merchant/AdminManagement'))
const Inventory = lazy(() => import('./pages/merchant/Inventory'))

function RoleHome() {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={homeForRole(role)} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="auth-page">
            <Loader label="Loading workspace…" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/shop" element={<Storefront />} />
          <Route path="/storefront" element={<Storefront />} />
          <Route path="/shop/checkout" element={<Checkout />} />
          <Route path="/storefront/checkout" element={<Checkout />} />
          <Route path="/shop/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/storefront/order/:orderId" element={<OrderConfirmation />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<PageWrapper />}>
              <Route path="/" element={<RoleHome />} />

              <Route element={<ProtectedRoute roles={['clerk']} />}>
                <Route path="/clerk" element={<ClerkDashboard />} />
              </Route>

              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/stock-entries" element={<StockEntries />} />
                <Route path="/admin/supply-requests" element={<SupplyRequests />} />
                <Route
                  path="/admin/supplier-payments"
                  element={<SupplierPayments />}
                />
                <Route path="/admin/clerks" element={<ClerkManagement />} />
                <Route path="/admin/alerts" element={<Alerts />} />
              </Route>

              <Route element={<ProtectedRoute roles={['merchant']} />}>
                <Route path="/merchant" element={<MerchantDashboard />} />
                <Route path="/merchant/analytics" element={<StoreAnalytics />} />
                <Route path="/merchant/branches" element={<Branches />} />
                <Route path="/merchant/admins" element={<AdminManagement />} />
                <Route path="/merchant/inventory" element={<Inventory />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}