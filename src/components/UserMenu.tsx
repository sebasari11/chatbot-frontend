import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen(!open);
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                <span className="font-medium text-sm dark:text-white">Opciones</span>
                <svg
                    className="w-4 h-4 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox='0 0 20 20'
                ><path d="M5.293 7.293L10 12l4.707-4.707-1.414-1.414L10 9.172 6.707 5.879z" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-gray-800 z-50">
                    <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        👤 Ver perfil
                    </Link>
                    <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        ⚙ Configuración
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        🚪 Cerrar sesión
                    </button>
                </div>
            )}
        </div >
    )
}