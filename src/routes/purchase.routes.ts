
import { Router } from 'express';
import validate from '../middlewares/validateRequest';
import { createPurchaseSchema } from '../schemas/purchase.schema';
import {
    createPurchaseHandler,
    getPurchaseByIdHandler,
} from '../controllers/purchase.controller';

const purchaseRouter = Router();


purchaseRouter.post('/', validate(createPurchaseSchema), createPurchaseHandler);


purchaseRouter.get('/:id', getPurchaseByIdHandler);

export default purchaseRouter;