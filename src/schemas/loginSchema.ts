import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email({ message: 'Correo inválido' }),
    password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
})

export type LoginData = z.infer<typeof loginSchema>