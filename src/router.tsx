import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuthContext } from './context/AuthContext'
import type { JSX } from 'react'
// import { ChatPage } from './pages/ChatPage'
import { ChatPage } from './pages/ChatPage2'
import ResourcesPage from './pages/ResourcesPage'
import HomeRedirect from './components/home/HomeRedirect'
import UsersPage from './pages/UsersPage'
import FaissPage from './pages/FaissPage'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuthContext()
    if (loading) {
        return <div className="h-screen flex items-center justify-center text-xl">Cargando...</div>
    }
    return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
            <Route path="/faiss" element={<ProtectedRoute><FaissPage /></ProtectedRoute>} />
            <Route path="/chat/:session_external_id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        </Routes>
    )
}