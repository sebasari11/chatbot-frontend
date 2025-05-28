import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/schemas/loginSchema'
import Input from '@/components/Input'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function LoginPage() {
    const { login } = useAuth()
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {
        try {
            await login(data.email, data.password)
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                setServerError(err.message)
            } else {
                setServerError('Error desconocido')
            }
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-mental dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
                {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
                <Input label="Correo" {...register('email')} error={errors.email?.message} />
                <Input label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
                <button type="submit" className="w-full bg-primary text-white rounded-lg p-2">Iniciar sesión</button>
            </form>
        </div>

    )
}