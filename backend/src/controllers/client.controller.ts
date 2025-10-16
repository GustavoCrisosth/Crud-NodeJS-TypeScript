
import { Request, Response } from 'express';
import {
    createClient,
    findAllClients,
    findClientById,
    updateClient,
    deleteClient,
} from '../services/client.service';
import { CreateClientInput, UpdateClientInput } from '../schemas/client.schema';


export async function createClientHandler(
    req: Request<{}, {}, CreateClientInput>,
    res: Response
) {
    try {
        const client = await createClient(req.body);
        return res.status(201).json(client);
    } catch (error: any) {

        if (error.message.includes('duplicate key')) {
            return res.status(409).json({ message: 'E-mail já cadastrado.' });
        }
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function getAllClientsHandler(req: Request, res: Response) {
    const clients = await findAllClients();
    return res.status(200).json(clients);
}


export async function getClientByIdHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const client = await findClientById(id);

    if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    return res.status(200).json(client);
}


export async function updateClientHandler(
    req: Request<{ id: string }, {}, UpdateClientInput>,
    res: Response
) {
    const id = parseInt(req.params.id, 10);
    const updatedClient = await updateClient(id, req.body);

    if (!updatedClient) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    return res.status(200).json(updatedClient);
}


export async function deleteClientHandler(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const client = await findClientById(id);

    if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    await deleteClient(id);
    return res.sendStatus(204);
}