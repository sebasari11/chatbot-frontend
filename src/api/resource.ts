import API from "./auth";
import type { Resource } from "@/types/resource";


export const getResources = () => API.get<Resource[]>("/resources/");
export const getResourceById = (resource_id: string) => API.get<Resource>(`/resources/${resource_id}/`);
export const createResource = (data: Partial<Resource>) => API.post<Resource>("/resources/", data);
export const processResource = (resource_id: string) => API.post<Resource>(`/resources/process/${resource_id}/`);
export const updateResource = (resource_id: string, data: Partial<Resource>) => API.put<Resource>(`/resources/${resource_id}/`, data);
export const deleteResource = (resource_id: string) => API.delete(`/resources/${resource_id}/`);
export const deleteChunksByResource = (resource_id: string) => API.delete(`/chunks/by_resource/${resource_id}/`);
export const processLocal = (formData: FormData) =>
  API.post("/resources/process_local/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });