import API from "./auth";
import type { Resource } from "@/types/resource";


export const getResources = () => API.get<Resource[]>("/resources/");
export const getResourceById = (resource_id: string) => API.get<Resource>(`/resources/${resource_id}/`);
export const createResource = (data: Partial<Resource>) => API.post<Resource>("/resources/", data);
export const processResource = (resource_id: string) => API.post<Resource>(`/resources/${resource_id}/process/`);
export const updateResource = (resource_id: string, data: Partial<Resource>) => API.put<Resource>(`/resources/${resource_id}/`, data);
export const deleteResource = (resource_id: string) => API.delete(`/resources/${resource_id}/`);
