import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
    full_name: z.string().min(5, { message: 'El nombre completo debe tener al menos 5 caracteres.' }),
    email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
    password: z
        .string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
            {
                message:
                    'La contraseña debe contener:\n- Una letra mayúscula\n- Una letra minúscula\n- Un número\n- Un carácter especial',
            }
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

export type RegisterData = z.infer<typeof registerSchema>