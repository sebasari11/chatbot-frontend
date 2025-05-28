import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuthContext } from './context/AuthContext'
import type { JSX } from 'react'
import { ChatPage } from './pages/ChatPage'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuthContext()
    return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <div className="p-4">Home (protegido)</div>
                    </ProtectedRoute>
                }
            />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        </Routes>
    )
}