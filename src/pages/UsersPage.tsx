import { useEffect, useState } from "react";
import { getUsers, updateUser } from "@/api/user";
import type { User } from "@/types/user";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import TopBar from "@/components/home/TopBar";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import { useAuth } from "@/hooks/useAuth";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { register: registerFn } = useAuth()
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        const res = await getUsers();
        setUsers(res.data);

    }

    useEffect(() => {
        setEditing(null);
        setShowModal(false);
        fetchUsers()
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = async (user: User) => {
        setEditing(null);
        setShowModal(false);
        setEditing(user);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditing(null);
        setShowModal(true);
    };

    const handleFormSubmit = async (data: Partial<User>) => {
        const userPayload = {
            username: data.username ?? "",
            email: data.email ?? "",
            password: data.password ?? "",
            full_name: data.full_name ?? ""
        };

        try {
            if (editing?.external_id) {
                await updateUser(editing.external_id, data);
            } else {
                await registerFn(userPayload);
            }
            setShowModal(false);
            await fetchUsers();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <div className="flex flex-col h-screen">
                <TopBar />
                <div className="flex-1 p-4 overflow-y-auto">
                    <h1 className="text-xl font-bold">Gestión de usuarios</h1>
                    <DialogTrigger asChild>
                        <button
                            onClick={handleCreate}
                            className="mb-6 bg-[#a0d7e7] hover:bg-[#a0d7e7] text-black font-semibold px-4 py-2 rounded-md"
                        >
                            Nuevo Usuario
                        </button>
                    </DialogTrigger>

                    <UserTable users={users} onEdit={handleEdit} />
                </div>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
                        <DialogDescription>
                            {editing
                                ? "Modifica los campos necesarios y guarda los cambios."
                                : "Completa los campos para crear un nuevo recurso."}
                        </DialogDescription>
                    </DialogHeader>
                    <UserForm
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
        </Dialog>

    );
}