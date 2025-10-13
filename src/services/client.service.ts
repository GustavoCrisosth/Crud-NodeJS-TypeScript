
import { Client } from '../models';
import { CreateClientInput, UpdateClientInput } from '../schemas/client.schema';


export async function createClient(input: CreateClientInput) {
    try {
        const client = await Client.create(input);
        return client;
    } catch (error: any) {

        throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
}


export async function findAllClients() {
    return Client.findAll();
}


export async function findClientById(id: number) {
    const client = await Client.findByPk(id);
    return client;
}


export async function updateClient(id: number, input: UpdateClientInput) {
    const client = await findClientById(id);

    if (!client) {
        return null;
    }

    await client.update(input);
    return client;
}


export async function deleteClient(id: number) {
    const client = await findClientById(id);

    if (!client) {
        return null;
    }

    await client.destroy();
    return client;
}