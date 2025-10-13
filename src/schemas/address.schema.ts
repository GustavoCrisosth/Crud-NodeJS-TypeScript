
import { z } from 'zod';

const addressBodySchema = z.object({
    street: z.string().min(3, { message: 'A rua deve ter no mínimo 3 caracteres.' }),
    number: z.string(),
    city: z.string().min(3, { message: 'A cidade deve ter no mínimo 3 caracteres.' }),
    state: z.string().length(2, { message: 'O estado deve ter 2 caracteres (ex: SP).' }),
    clientId: z.number(),
});

export const createAddressSchema = z.object({
    body: addressBodySchema,
});

export const updateAddressSchema = z.object({

    body: addressBodySchema.partial(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>['body'];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>['body'];