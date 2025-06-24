export type UserRole = "user" | "admin";

export const roleLabels: Record<UserRole, string> = {
    user: "Usuario",
    admin: "Administrador",
};

export const roleOptions = Object.entries(roleLabels);
export interface User {
    external_id: string
    username: string
    email: string
    full_name: string
    created_at: string
    password?: string
    role: UserRole
}

export interface Token {
    access_token: string
    token_type: string
}