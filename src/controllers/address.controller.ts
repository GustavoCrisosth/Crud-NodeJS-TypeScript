

import { Request, Response } from 'express';
import {
    createAddress,
    findAddressesByClientId,
    updateAddress,
    deleteAddress,
    findAddressById,
} from '../services/address.service';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema';


export async function createAddressHandler(
    req: Request<{}, {}, CreateAddressInput>,
    res: Response
) {
    try {
        const address = await createAddress(req.body);
        return res.status(201).json(address);
    } catch (error: any) {

        if (error.message === 'Cliente não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function getAddressesForClientHandler(req: Request, res: Response) {

    const clientId = req.query.clientId;


    if (!clientId || typeof clientId !== 'string') {
        return res
            .status(400)
            .json({ message: 'O query param "clientId" é obrigatório.' });
    }

    try {
        const numericClientId = parseInt(clientId, 10);
        if (isNaN(numericClientId)) {
            return res.status(400).json({ message: '"clientId" deve ser um número.' });
        }

        const addresses = await findAddressesByClientId(numericClientId);
        return res.status(200).json(addresses);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function updateAddressHandler(
    req: Request<{ id: string }, {}, UpdateAddressInput>,
    res: Response
) {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedAddress = await updateAddress(id, req.body);

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        }

        return res.status(200).json(updatedAddress);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function deleteAddressHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const address = await findAddressById(id);

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        }

        await deleteAddress(id);
        return res.sendStatus(204);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}