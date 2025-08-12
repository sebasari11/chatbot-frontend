import { useNavigate } from "react-router-dom";
import iconDefault from "@/assets/favicon.webp";

interface HomeButtonProps {
    iconSrc?: string;
    alt?: string;
    to?: string;
    size?: number;
}

const HomeButton = ({
    iconSrc = iconDefault,
    alt = "Inicio",
    to = "/",
    size = 8,
}: HomeButtonProps) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
        >
            <img
                src={iconSrc}
                alt={alt}
                className={`w-${size} h-${size} rounded-full object-cover`}
            />
            <span className="sr-only">{alt}</span>
        </button>
    );
};

export default HomeButton;
