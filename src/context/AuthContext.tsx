import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types/user'
import { fetchMe, setAuthToken } from '../api/auth'

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

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
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)