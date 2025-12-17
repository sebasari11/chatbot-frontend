export interface FaissIndexDeleteResponse {
    message: string;
    deleted_files: string[];
    new_index_dimension: number;
}

export interface FaissIndexCreateRequest {
    dimension?: number;
}

export interface FaissIndexResetResponse {
    message: string;
    index_dimension: number;
    index_created: boolean;
}

