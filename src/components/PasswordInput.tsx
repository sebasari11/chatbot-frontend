import { type InputHTMLAttributes, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    register: UseFormRegisterReturn
}

export const PasswordInput = ({ label, error, register, ...rest }: PasswordInputProps) => {
    const [show, setShow] = useState(false)

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    className={`w-full px-4 py-2 rounded border ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    {...register}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-2 text-gray-600"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}