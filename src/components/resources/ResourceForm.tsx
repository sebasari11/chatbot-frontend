import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Resource, ResourceType } from "@/types/resource";
import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { processLocal } from "@/api/resource";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
    initialData?: Resource;
    onSubmit: (data: Partial<Resource>) => void;
    isEditing?: boolean;
}

interface FormValues {
    name: string;
    filepath: string;
    type: ResourceType;
    file?: FileList;
}

const resourceTypes: ResourceType[] = ["pdf", "database", "url"];

export const ResourceForm: React.FC<Props> = ({ initialData, onSubmit, isEditing = false }) => {
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
    
    const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
        if (data.type === "pdf" && data.file?.[0]) {
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
  }
};


    return (
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
                        className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
            </div>
            ) : (
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ruta del archivo</label>
                <input
                type="text"
                {...register("filepath", { required: "La ruta es requerida" })}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                {errors.filepath && <p className="text-red-500 text-sm mt-1">{errors.filepath.message}</p>}
            </div>
            )}


            {!isEditing && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                    <select
                        {...register("type", { required: true })}
                        className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
                {isEditing && <button
                    type="button"
                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    title="Remover Chunks"
                >
                    <Trash2 className="w-5 h-5" /> Chunks
                    <span className="sr-only">Remover Chunks</span>
                </button>}

                <button
                    type="submit"
                    className="flex-1 flex items-center justify-center bg-[#a0d7e7] hover:bg-[#88cde3] text-white font-semibold py-2 px-4 rounded-md transition-colors"
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
    );
};
