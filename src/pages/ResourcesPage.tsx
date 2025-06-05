import { useEffect, useState } from "react";
import {
    getResources,
    createResource,
    updateResource,
    //   processResource,
    deleteResource,
} from "@/api/resource";
import type { Resource } from "@/types/resource";
import ResourceTable from "@/components/ResourceTable";
import { ResourceForm } from "@/components/resources/ResourceForm";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [editing, setEditing] = useState<Resource | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchResources = async () => {
        const res = await getResources();
        setResources(res.data);
    };

    useEffect(() => {
        setEditing(null);
        setShowModal(false);
        fetchResources();
    }, []);

    const handleEdit = (resource: Resource) => {
        setEditing(null);
        setShowModal(false);
        setEditing(resource);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditing(null);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar este recurso?")) {
            await deleteResource(id);
            fetchResources();
        }
    };

    const handleFormSubmit = async (data: Partial<Resource>) => {
        if (editing) {
            await updateResource(editing.external_id, data);
        } else {
            await createResource(data); // este debe aceptar { name, filepath, type, processed }
        }
        setShowModal(false);
        fetchResources();
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Gestión de Recursos</h1>

                <DialogTrigger asChild>
                    <button
                        onClick={handleCreate}
                        className="mb-6 bg-[#a0d7e7] hover:bg-[#a0d7e7] text-black font-semibold px-4 py-2 rounded-md"
                    >
                        Nuevo Recurso
                    </button>
                </DialogTrigger>

                <ResourceTable
                    resources={resources}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onProcess={(resource: Resource) => {
                        throw new Error("Function not implemented.");
                    }}
                />
            </div>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editing ? "Editar Recurso" : "Nuevo Recurso"}</DialogTitle>
                    <DialogDescription>
                        {editing
                            ? "Modifica los campos necesarios y guarda los cambios."
                            : "Completa los campos para crear un nuevo recurso."}
                    </DialogDescription>
                </DialogHeader>
                <ResourceForm
                    initialData={editing ?? undefined}
                    isEditing={!!editing}
                    onSubmit={handleFormSubmit}
                />
                <DialogClose asChild>
                    <button className="mt-4 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-white rounded-md py-2">
                        Cancelar
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>

    );
}