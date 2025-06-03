import React from "react";

interface SubmitButtonProps {
  label: string;
  disabled: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, disabled }) => {
  return (
    <button
      type="submit"
      className={`w-full rounded-lg p-2 transition font-medium ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};