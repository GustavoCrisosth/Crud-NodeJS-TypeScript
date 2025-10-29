
import { z } from 'zod';

export const clientFormSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;