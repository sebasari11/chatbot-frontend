import type { User } from "@/types/user";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
    initialData?: User;
    onSubmit: (data: Partial<User>) => void;
    isEditing?: boolean;
    loading?: boolean;
}

interface FormValues {
    username: string;
    email: string;
    full_name: string;
    password?: string;
    role?: "user" | "admin";
}



const UserForm: React.FC<Props> = ({ initialData, onSubmit, isEditing = false, loading = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            username: initialData?.username || "",
            email: initialData?.email || "",
            full_name: initialData?.full_name || "",
            role: initialData?.role ?? undefined,
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (<div>
                <label className="block font-semibold mb-1">Usuario</label>
                <input
                    {...register("username", { required: "El usuario es requerido" })}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                />
                {errors.username && <p className="text-red-600">{errors.username.message}</p>}
            </div>)}

            {!isEditing && (<div>
                <label className="block font-semibold mb-1">Correo electrónico</label>
                <input
                    type="email"
                    {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email inválido",
                        },
                    })}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                />
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>)}

            <div>
                <label className="block font-semibold mb-1">Nombre completo</label>
                <input
                    {...register("full_name", { required: "El nombre completo es requerido" })}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                />
                {errors.full_name && <p className="text-red-600">{errors.full_name.message}</p>}
            </div>

            {!isEditing && (
                <div>
                    <label className="block font-semibold mb-1">Contraseña</label>
                    <input
                        type="password"
                        {...register("password", { required: "La contraseña es requerida" })}
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                    {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                </div>
            )}


            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
            </button>
        </form>
    );
};

export default UserForm;
