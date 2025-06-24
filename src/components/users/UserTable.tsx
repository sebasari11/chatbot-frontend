import { roleLabels, type User } from "@/types/user";
import { Pencil } from "lucide-react";

interface Props {
    users: User[];
    onEdit: (user: User) => void;
    // onDelete: (id: string) => void;
}

export default function UserTable({ users, onEdit }: Props) {
    return (
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre de Usuario</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {users.map((u) => (
                        <tr key={u.external_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-800">{u.username}</td>
                            <td className="px-6 py-4 text-sm text-gray-800 capitalize">{u.full_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {roleLabels[u.role] ?? u.role}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button
                                    onClick={() => onEdit(u)}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition"
                                    title="Editar"
                                >
                                    <Pencil size={18} />
                                </button>
                                {/* <button
                                    onClick={() => onDelete(u.external_id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}