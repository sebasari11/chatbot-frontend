import type { Resource } from "@/types/resource";
import { Pencil, Play, Trash2 } from "lucide-react";

interface Props {
    resources: Resource[];
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
    onProcess: (resource: Resource) => void;
}

export default function ResourceTable({ resources, onEdit, onDelete, onProcess }: Props) {
    return (
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Creado</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {resources.map((res) => (
                        <tr key={res.external_id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-800">{res.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-800 capitalize">{res.type}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {res.created_at ? new Date(res.created_at).toLocaleString() : "—"}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button
                                    onClick={() => onProcess(res)}
                                    className={`p-2 rounded-md shadow-sm transition ${res.processed
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                    title={res.processed ? "Ya procesado" : "Procesar"}
                                    disabled={res.processed}

                                >
                                    <Play size={18} />
                                </button>
                                <button
                                    onClick={() => onEdit(res)}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition"
                                    title="Editar"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(res.external_id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}