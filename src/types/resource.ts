export type ResourceType = 'pdf' | 'database' | 'url';

export interface ChunkResponse {
    resource_id: string;
    chunk_text: string;
}

export interface ResourceBase {
    external_id: string;
    name: string;
    type: string;
    filepath?: string;
    processed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Resource extends ResourceBase {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    chunks: ChunkResponse[];
}