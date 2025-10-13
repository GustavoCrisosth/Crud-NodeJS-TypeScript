
import { Address, Client } from '../models';
import { CreateAddressInput, UpdateAddressInput } from '../schemas/address.schema';


export async function createAddress(input: CreateAddressInput) {

    const client = await Client.findByPk(input.clientId);
    if (!client) {
        throw new Error('Cliente não encontrado.');
    }

    try {
        const address = await Address.create(input);
        return address;
    } catch (error: any) {
        throw new Error(`Erro ao criar endereço: ${error.message}`);
    }
}


export async function findAddressesByClientId(clientId: number) {
    return Address.findAll({
        where: {
            clientId: clientId,
        },
    });
}


export async function findAddressById(id: number) {
    return Address.findByPk(id);
}



export async function updateAddress(id: number, input: UpdateAddressInput) {
    const address = await findAddressById(id);

    if (!address) {
        return null;
    }

    await address.update(input);
    return address;
}


export async function deleteAddress(id: number) {
    const address = await findAddressById(id);

    if (!address) {
        return null;
    }

    await address.destroy();
    return address;
}