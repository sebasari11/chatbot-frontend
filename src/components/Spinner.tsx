import React from "react";

export const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
    );
};