
import { Request, Response } from 'express';
import {
    createPurchase,
    findPurchaseById,
    findPurchasesByClientId,
    findAllPurchases,
} from '../services/purchase.service';
import { CreatePurchaseInput } from '../schemas/purchase.schema';


export async function createPurchaseHandler(
    req: Request<{}, {}, CreatePurchaseInput>,
    res: Response
) {
    try {
        const purchase = await createPurchase(req.body);
        return res.status(201).json(purchase);
    } catch (error: any) {

        if (
            error.message.includes('não encontrado')
        ) {
            return res.status(404).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Erro interno ao criar a compra.' });
    }
}


export async function getPurchaseByIdHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const purchase = await findPurchaseById(id);

        if (!purchase) {
            return res.status(404).json({ message: 'Compra não encontrada.' });
        }

        return res.status(200).json(purchase);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function getPurchasesForClientHandler(req: Request, res: Response) {
    try {

        const clientId = parseInt(req.params.clientId, 10);
        const purchases = await findPurchasesByClientId(clientId);


        return res.status(200).json(purchases);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}

export async function getAllPurchasesHandler(req: Request, res: Response) {
    try {
        const purchases = await findAllPurchases();
        return res.status(200).json(purchases);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}