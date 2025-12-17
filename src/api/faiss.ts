import API from "./auth";
import type {
    FaissIndexDeleteResponse,
    FaissIndexCreateRequest,
    FaissIndexResetResponse,
} from "@/types/faiss";

export const deleteFaissIndex = () =>
    API.delete<FaissIndexDeleteResponse>("/faiss-index/");

export const resetFaissIndex = (data: FaissIndexCreateRequest) =>
    API.post<FaissIndexResetResponse>("/faiss-index/reset", data);

export const createFaissIndex = (data: FaissIndexCreateRequest) =>
    API.post<FaissIndexResetResponse>("/faiss-index/create", data);

