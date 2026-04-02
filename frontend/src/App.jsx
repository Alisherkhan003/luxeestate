import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'

// Public pages
import Home        from './pages/Home'
import Properties  from './pages/Properties'
import Property    from './pages/Property'

// Admin pages
import AdminLogin     from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminListings  from './pages/admin/Listings'
import AdminAddEdit   from './pages/admin/AddEdit'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060606' }}>
      <div style={{ width:32, height:32, border:'2px solid #C9A84C', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
    </div>
  )
  return user ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Home />} />
          <Route path="/properties"    element={<Properties />} />
          <Route path="/properties/:id" element={<Property />} />

          {/* Admin */}
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute><AdminListings /></ProtectedRoute>} />
          <Route path="/admin/add"      element={<ProtectedRoute><AdminAddEdit /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminAddEdit /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
