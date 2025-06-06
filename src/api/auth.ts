import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000',
})

export const setAuthToken = (token: string | null) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete API.defaults.headers.common['Authorization']
    }
}

export const registerUser = (data: {
    username: string
    email: string
    password: string
    full_name: string
}) => API.post('/users/', data)

export const loginUser = async (data: { email: string; password: string }) => {
    const form = new URLSearchParams()
    form.append('username', data.email)
    form.append('password', data.password)
    const response = await axios.post('http://localhost:8000/users/login', form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    return response.data
}

export const fetchMe = () => API.get('/me')

export default API