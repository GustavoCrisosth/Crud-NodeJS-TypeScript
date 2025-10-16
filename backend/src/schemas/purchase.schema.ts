

import { z } from 'zod';


const productInPurchaseSchema = z.object({
    productId: z.number(),

    quantity: z.number().int().positive({ message: 'A quantidade deve ser um número inteiro positivo.' }),
});


const purchaseBodySchema = z.object({
    clientId: z.number(),

    products: z.array(productInPurchaseSchema).nonempty({ message: 'A lista de produtos não pode estar vazia.' }),
});



export const createPurchaseSchema = z.object({
    body: purchaseBodySchema,
});



export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>['body'];