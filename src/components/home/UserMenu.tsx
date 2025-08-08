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
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
    const { logout } = useAuth();
    const { user } = useAuthContext();
    const navigate = useNavigate();

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
                            <DropdownMenuItem onClick={() => navigate('/users')}>
                                <Users className="mr-2 h-4 w-4" />
                                Gestionar Usuarios
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/resources')}>
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
    )
}