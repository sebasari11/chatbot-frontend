// src/components/resources/ResourceForm.tsx
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Resource, ResourceType } from "@/types/resource";

interface Props {
    initialData?: Resource;
    onSubmit: (data: Partial<Resource>) => void;
    isEditing?: boolean;
}

interface FormValues {
    name: string;
    filepath: string;
    type: ResourceType;
}

const resourceTypes: ResourceType[] = ["pdf", "database", "web"];

export const ResourceForm: React.FC<Props> = ({ initialData, onSubmit, isEditing = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: initialData?.name || "",
            filepath: initialData?.filepath || "",
            type: initialData?.type || "pdf",
        },
    });

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        const formattedData: Partial<Resource> = {
            name: data.name,
            filepath: data.filepath,
            ...(isEditing ? {} : { type: data.type, processed: false }),
        };
        onSubmit(formattedData);
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? "Editar recurso" : "Crear nuevo recurso"}
            </h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                    type="text"
                    {...register("name", { required: "El nombre es requerido" })}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ruta del archivo</label>
                <input
                    type="text"
                    {...register("filepath", { required: "La ruta es requerida" })}
                    className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                {errors.filepath && <p className="text-red-500 text-sm mt-1">{errors.filepath.message}</p>}
            </div>

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

            <button
                type="submit"
                className="w-full bg-[#a0d7e7] hover:bg-[#88cde3] text-white font-semibold py-2 px-4 rounded-md"
            >
                {isEditing ? "Actualizar" : "Crear"}
            </button>
        </form>
    );
};
