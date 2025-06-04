export type ResourceType = 'pdf' | 'database' | 'web';

export type Resource = {
    external_id: string;
    name: string;
    type: ResourceType;
    filepath?: string;
    processed: boolean;
    created_by_id?: number;
    created_at?: string;
    updated_by_id?: number;
    updated_at?: string;
}