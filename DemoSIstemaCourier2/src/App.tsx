import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

const ClientPortal = lazy(() => import('./pages/ClientPortal'))
const AdminPortal = lazy(() => import('./pages/AdminPortal'))

export default function App() {
  const navigate = useNavigate()

  const login = (destination: 'cliente' | 'admin', role: string) => {
    sessionStorage.setItem('brodpaq-role', role)
    navigate(`/${destination}`)
  }

  const logout = () => {
    sessionStorage.removeItem('brodpaq-role')
    navigate('/login')
  }

  return (
    <Suspense fallback={<div className="app-loading"><span>BP</span><strong>Preparando tu espacio...</strong></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/cliente" element={<ClientPortal onLogout={logout} />} />
        <Route path="/admin" element={<AdminPortal role={sessionStorage.getItem('brodpaq-role') || 'Administrador general'} onLogout={logout} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
