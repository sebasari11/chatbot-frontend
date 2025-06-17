export interface User {
    external_id: string
    username: string
    email: string
    full_name: string
    created_at: string
    password?: string
    role: 'user' | 'admin'
}

export interface Token {
    access_token: string
    token_type: string
}