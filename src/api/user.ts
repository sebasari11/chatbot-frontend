import type { User } from "@/types/user";
import API from "./auth";

export const getUsers = () => API.get<User[]>("/users/");
export const createUser = (data: Partial<User>) => API.post<User>("/users/", data);
export const updateUser = (user_id: string, data: Partial<User>) => API.put<User>(`/users/${user_id}/`, data);
// export const deleteUser = (user_id: string) => API.delete(`/users/${user_id}/`);