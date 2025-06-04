import { useEffect, useState } from "react";
import {
    getResources,
    // createResource,
    // updateResource,
    //   processResource,
    deleteResource,
} from "@/api/resource";
import type { Resource } from "@/types/resource";
import ResourceTable from "@/components/ResourceTable";

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [editing, setEditing] = useState<Resource | null>(null);

    const fetchResources = async () => {
        const res = await getResources();
        setResources(res.data);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar este recurso?")) {
            await deleteResource(id);
            fetchResources();
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gestión de Recursos</h1>
            <hr className="my-6" />
            <ResourceTable resources={resources} onEdit={setEditing} onDelete={handleDelete} onProcess={function (resource: Resource): void {
                throw new Error("Function not implemented.");
            }} />
        </div>
    );
}