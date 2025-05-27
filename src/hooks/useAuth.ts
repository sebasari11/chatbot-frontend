import { useAuthContext } from '../context/AuthContext'
import { loginUser, registerUser, setAuthToken, fetchMe } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

export const useAuth = () => {
    const { setUser } = useAuthContext()
    const navigate = useNavigate()

    const login = async (email: string, password: string) => {
        try {
            const res = await loginUser({ email, password })
            const token = res.access_token
            localStorage.setItem('token', token)
            setAuthToken(token)
            const me = await fetchMe().then(res => res.data)
            setUser(me)
            navigate('/')
        } catch (err: unknown) {
            const error = err as AxiosError<{ detail: string }>
            const message =
                error.response?.data?.detail ||
                error.message ||
                'Ocurrió un error al iniciar sesión'
            throw new Error(message)
        }
    }

    const register = async (data: {
        username: string
        email: string
        password: string
        full_name: string
    }) => {
        try {
            await registerUser(data)
            await login(data.email, data.password)
        } catch (err: unknown) {
            const error = err as AxiosError<{ detail: string }>
            const message =
                error.response?.data?.detail ||
                error.message ||
                'Ocurrió un error al registrar'
            throw new Error(message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setAuthToken(null)
        navigate('/login')
    }

    return { login, register, logout }
}