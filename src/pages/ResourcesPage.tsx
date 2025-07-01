import { useEffect, useState } from "react";
import {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    processResource,
} from "@/api/resource";
import type { Resource } from "@/types/resource";
import ResourceTable from "@/components/resources/ResourceTable";
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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import TopBar from "@/components/home/TopBar";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [editing, setEditing] = useState<Resource | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
    const [resourceToProcess, setResourceToProcess] = useState<Resource | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const fetchResources = async () => {
        const res = await getResources();
        setResources(res.data);
    };

    const fetchResource = async (id: string) => {
        const res = await getResourceById(id);
        return res.data;
    }


    useEffect(() => {
        setEditing(null);
        setShowModal(false);
        fetchResources();
    }, []);

    const handleEdit = async (resource: Resource) => {
        setEditing(null);
        setShowModal(false);
        const editResource = await fetchResource(resource.external_id);
        setEditing(editResource);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditing(null);
        setShowModal(true);
    };

    const handleDelete = (resource: Resource) => {
        setResourceToDelete(resource);
    };

    const handleProcess = (resource: Resource) => {
        setResourceToProcess(resource);
    };

    const confirmDelete = async () => {
        if (resourceToDelete) {
            await deleteResource(resourceToDelete.external_id);
            setResourceToDelete(null);
            fetchResources();
        }
    };

    const confirmProcess = async () => {
        if (resourceToProcess) {
            setIsProcessing(true);
            try {
                await processResource(resourceToProcess.external_id);
                setResourceToProcess(null);
                fetchResources();
            } catch (error) {
                console.error("Error al procesar el recurso:", error);
            } finally {
                setIsProcessing(false);
                setResourceToProcess(null);
            }
        }
    };

    const handleFormSubmit = async (data: Partial<Resource>) => {
        if (editing) {
            await updateResource(editing.external_id, data);
        } else {
            if (data.type !== "pdf") {
                await createResource(data);
            }
        }
        setShowModal(false);
        await fetchResources();
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <div className="flex flex-col h-screen">
                <TopBar />
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
                        onProcess={handleProcess}
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
            </div>
            <AlertDialog open={!!resourceToDelete} onOpenChange={(open) => !open && setResourceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El recurso será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!resourceToProcess} onOpenChange={(open) => !open && setResourceToProcess(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Procesar recurso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            El recurso será procesado según su tipo. Esta acción puede tardar unos segundos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmProcess}>Procesar</AlertDialogAction>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
            {isProcessing && <LoadingOverlay />}
        </Dialog>


    );
}