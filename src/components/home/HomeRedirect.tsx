import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const HomeRedirect = () => {
    const { user, loading } = useAuthContext();

    if (loading) {
        console.log("Loading user authentication status...", loading);

        return <div className="h-screen flex items-center justify-center text-xl">Cargando...</div>;
    }

    return <Navigate to={user ? "/chat" : "/login"} />;
};

export default HomeRedirect;