import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
                <input
                    ref={ref}
                    {...props}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 ${className}`}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        )
    }
)

export default Input