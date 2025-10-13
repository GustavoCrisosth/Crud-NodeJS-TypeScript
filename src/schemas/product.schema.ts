
import { z } from 'zod';

const productBodySchema = z.object({
    name: z.string().min(3, { message: 'O nome do produto deve ter no mínimo 3 caracteres.' }),

    price: z.number().positive({ message: 'O preço deve ser um número positivo.' }),

    description: z.string().optional(),
});

export const createProductSchema = z.object({
    body: productBodySchema,
});

export const updateProductSchema = z.object({
    body: productBodySchema.partial(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];