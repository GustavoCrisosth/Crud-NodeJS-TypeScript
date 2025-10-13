

import { z } from 'zod';


const createBodySchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
    email: z.string().email({ message: 'Formato de e-mail inválido.' }),
});


export const createClientSchema = z.object({
    body: createBodySchema,
});


export const updateClientSchema = z.object({
    body: createBodySchema.partial(),
});


export type CreateClientInput = z.infer<typeof createClientSchema>['body'];
export type UpdateClientInput = z.infer<typeof updateClientSchema>['body'];