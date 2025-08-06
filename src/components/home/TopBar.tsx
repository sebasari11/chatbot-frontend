import HomeButton from "./HomeButton";
import UserMenu from "./UserMenu";


interface TopBarProps {
    showHomeButton?: boolean;
    showUserMenu?: boolean;
    className?: string;
}

const TopBar = ({
    showHomeButton = true,
    showUserMenu = true,
    className = "",
}: TopBarProps) => {
    return (
        <div
            className={`flex justify-between items-center p-4 border-b bg-white dark:bg-gray-900 sticky top-0 z-10 ${className}`}
        >
            {showHomeButton ? <HomeButton size={10} /> : <div />}
            {showUserMenu && <UserMenu />}
        </div>
    );
};

export default TopBar;
