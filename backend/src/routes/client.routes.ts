
import { Router } from 'express';
import validate from '../middlewares/validateRequest';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';
import {
    createClientHandler,
    deleteClientHandler,
    getAllClientsHandler,
    getClientByIdHandler,
    updateClientHandler,
} from '../controllers/client.controller';
import { getPurchasesForClientHandler } from '../controllers/purchase.controller';

const clientRouter = Router();


clientRouter.post('/', validate(createClientSchema), createClientHandler);


clientRouter.get('/', getAllClientsHandler);


clientRouter.get('/:id', getClientByIdHandler);


clientRouter.patch('/:id', validate(updateClientSchema), updateClientHandler);


clientRouter.delete('/:id', deleteClientHandler);

clientRouter.get('/:clientId/purchases', getPurchasesForClientHandler);

export default clientRouter;