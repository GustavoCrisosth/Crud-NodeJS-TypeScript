
import { Router } from 'express';
import validate from '../middlewares/validateRequest';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import {
    createProductHandler,
    deleteProductHandler,
    getAllProductsHandler,
    getProductByIdHandler,
    updateProductHandler,
} from '../controllers/product.controller';

const productRouter = Router();


productRouter.post('/', validate(createProductSchema), createProductHandler);


productRouter.get('/', getAllProductsHandler);


productRouter.get('/:id', getProductByIdHandler);


productRouter.patch('/:id', validate(updateProductSchema), updateProductHandler);


productRouter.delete('/:id', deleteProductHandler);

export default productRouter;