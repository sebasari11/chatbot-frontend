import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types/user'
import { fetchMe, setAuthToken } from '../api/auth'

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setAuthToken(token)
            fetchMe()
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token')
                    setUser(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)