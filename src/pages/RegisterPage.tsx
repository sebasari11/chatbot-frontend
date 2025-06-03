import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import { registerSchema, type RegisterData } from '../schemas/registerSchema'
import { useState } from 'react'
import { PasswordInput } from '../components/PasswordInput'
import { SubmitButton } from '@/components/SubmitButton'


export default function RegisterPage() {
    const { register: registerFn } = useAuth()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) })
    const [serverError, setServerError] = useState<string | null>(null)

    const email = watch("email");
    const full_name = watch("full_name");
    const password = watch("password");
    const confirmPassword = watch("confirmPassword")
    const isDisabled = !email || !password || !full_name || !confirmPassword;

    const onSubmit = async (data: RegisterData) => {
        try {
            await registerFn(data)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setServerError(err.message)
            } else {
                setServerError('Error desconocido')
            }
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-mental dark:bg-gray-800">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
            >
                {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
                <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">Registro</h2>

                <Input {...register('username')} label="Usuario" error={errors.username?.message} />

                <Input {...register('full_name')} label="Nombre completo" error={errors.full_name?.message} />

                <Input {...register('email')} label="Correo" error={errors.email?.message} />

                <PasswordInput
                    label="Contraseña"
                    register={register('password')}
                    error={errors.password?.message}
                />

                <PasswordInput
                    label="Repetir Contraseña"
                    register={register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />

                <SubmitButton label="Registrarse" disabled={isDisabled} />
            </form>
        </div>
    )
}