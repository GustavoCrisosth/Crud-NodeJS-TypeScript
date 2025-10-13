
import { Router } from 'express';
import validate from '../middlewares/validateRequest';
import { createAddressSchema, updateAddressSchema } from '../schemas/address.schema';
import {
    createAddressHandler,
    deleteAddressHandler,
    getAddressesForClientHandler,
    updateAddressHandler,
} from '../controllers/address.controller';

const addressRouter = Router();


addressRouter.post('/', validate(createAddressSchema), createAddressHandler);


addressRouter.get('/', getAddressesForClientHandler);


addressRouter.patch('/:id', validate(updateAddressSchema), updateAddressHandler);


addressRouter.delete('/:id', deleteAddressHandler);

export default addressRouter;