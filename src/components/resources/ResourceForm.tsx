import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Resource, ResourceType } from "@/types/resource";
import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { processLocal } from "@/api/resource";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Props {
    initialData?: Resource;
    onSubmit: (data: Partial<Resource>) => void;
    isEditing?: boolean;
    onDeleteChunks?: (resourceId: string) => Promise<void>;
}

interface FormValues {
    name: string;
    filepath: string;
    type: ResourceType;
    file?: FileList;
}

const resourceTypes: ResourceType[] = ["pdf", "database", "url"];

export const ResourceForm: React.FC<Props> = ({ initialData, onSubmit, isEditing = false, onDeleteChunks }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<FormValues>({
        defaultValues: {
            name: initialData?.name || "",
            filepath: initialData?.filepath || "",
            type: (initialData?.type as ResourceType) || ("pdf" as ResourceType),
        },
    });

    const resourceType = watch("type");

    useEffect(() => {
        const file = watch("file")?.[0];
        if (resourceType === "pdf" && file) {
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            setValue("name", fileNameWithoutExtension);
        }
    }, [watch("file"), resourceType]);

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteChunksDialog, setShowDeleteChunksDialog] = useState(false);

    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (data.type === "pdf" && data.file?.[0]) {
                setIsLoading(true);
                const formData = new FormData();
                formData.append("file", data.file[0]);
                formData.append("name", data.name);
                await processLocal(formData);

                setSuccessMessage("✅ El recurso PDF fue procesado correctamente.");
                setShowSuccessDialog(true);
            }
            else {
                const formattedData: Partial<Resource> = {
                    ...(data.type !== "url" && { name: data.name }),
                    filepath: data.filepath,
                    type: data.type,
                    processed: false,
                };
                onSubmit(formattedData);
                setSuccessMessage("✅ Recurso creado correctamente.");
                setShowSuccessDialog(true);
            }
        } catch (error) {
            console.error("Error al subir o procesar el recurso:", error);
            alert("Ocurrió un error al subir o procesar el archivo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteChunks = async () => {
        if (!initialData?.external_id || !onDeleteChunks) return;
        
        try {
            setIsLoading(true);
            await onDeleteChunks(initialData.external_id);
            setSuccessMessage("✅ Los chunks fueron eliminados correctamente.");
            setShowSuccessDialog(true);
            setShowDeleteChunksDialog(false);
        } catch (error) {
            console.error("Error al eliminar chunks:", error);
            alert("Ocurrió un error al eliminar los chunks.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            {isLoading && <LoadingOverlay />}
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {isEditing ? "Editar recurso" : "Crear nuevo recurso"}
                </h2>

                {resourceType !== "url" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <input
                            type="text"
                            {...register("name", { required: "El nombre es requerido" })}
                            disabled={isLoading}
                            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                )}

                {resourceType === "url" ? (

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                        <input
                            type="text"
                            {...register("filepath", { required: "La URL es requerida" })}
                            disabled={isLoading}
                            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.filepath && <p className="text-red-500 text-sm mt-1">{errors.filepath.message}</p>}
                    </div>
                ) : resourceType === "pdf" ? (

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            {...register("file", { required: "Debe seleccionar un archivo PDF" })}
                            disabled={isLoading}
                            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
                    </div>
                ) : (

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ruta del archivo</label>
                        <input
                            type="text"
                            {...register("filepath", { required: "La ruta es requerida" })}
                            disabled={isLoading}
                            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.filepath && <p className="text-red-500 text-sm mt-1">{errors.filepath.message}</p>}
                    </div>
                )}


                {!isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select
                            {...register("type", { required: true })}
                            disabled={isLoading}
                            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resourceTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    {isEditing && onDeleteChunks && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteChunksDialog(true)}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remover Chunks"
                        >
                            <Trash2 className="w-5 h-5" /> Chunks
                            <span className="sr-only">Remover Chunks</span>
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center bg-[#a0d7e7] hover:bg-[#88cde3] text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isEditing ? "Actualizar" : "Crear"}
                    >
                        {isEditing ? (
                            <Save className="w-5 h-5" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        <span className="sr-only">{isEditing ? "Actualizar" : "Crear"}</span>
                    </button>
                </div>

            </form>
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Operación exitosa</AlertDialogTitle>
                        <AlertDialogDescription>{successMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                            Aceptar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteChunksDialog} onOpenChange={setShowDeleteChunksDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar chunks?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará todos los chunks asociados a este recurso. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteChunks}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
