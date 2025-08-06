import React from "react";
import { Spinner } from "./Spinner"; // usa tu spinner existente

export const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <Spinner />
        </div>
    );
};