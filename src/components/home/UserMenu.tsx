import { useAuth } from '@/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FolderKanban, LogOut, Settings, User, UserIcon, Users } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

export default function UserMenu() {
    const { logout } = useAuth();
    const { user } = useAuthContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer bg-mental text-black rounded-full w-10 h-10 flex items-center justify-center">
                    <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full">
                        {user?.full_name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2 mr-2">
                <DropdownMenuItem onClick={() => alert('Ver perfil')}>
                    <User className="w-4 h-4 mr-2" />
                    <span>Ver perfil</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Settings className="w-4 h-4 mr-2" />
                            <span>Configuración</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => window.location.href = '/users'}>
                                <Users className="mr-2 h-4 w-4" />
                                Gestionar Usuarios
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = '/resources'}>
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Gestionar Recursos
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                )}
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-500">Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>


        // <div className="relative inline-block text-left" ref={menuRef}>
        //     <button
        //         onClick={toggleMenu}
        //         className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
        //         <span className="font-medium text-sm dark:text-white">Opciones</span>
        //         <svg
        //             className="w-4 h-4 dark:text-white"
        //             xmlns="http://www.w3.org/2000/svg"
        //             viewBox='0 0 20 20'
        //         ><path d="M5.293 7.293L10 12l4.707-4.707-1.414-1.414L10 9.172 6.707 5.879z" />
        //         </svg>
        //     </button>
        //     {open && (
        //         <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-gray-800 z-50">
        //             <Link
        //                 to="/profile"
        //                 className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        //                 onClick={() => setOpen(false)}
        //             >
        //                 👤 Ver perfil
        //             </Link>
        //             <Link
        //                 to="/settings"
        //                 className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        //                 onClick={() => setOpen(false)}
        //             >
        //                 ⚙ Configuración
        //             </Link>
        //             <button
        //                 onClick={() => {
        //                     logout();
        //                     setOpen(false);
        //                 }}
        //                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
        //             >
        //                 🚪 Cerrar sesión
        //             </button>
        //         </div>
        //     )}
        // </div >
    )
}