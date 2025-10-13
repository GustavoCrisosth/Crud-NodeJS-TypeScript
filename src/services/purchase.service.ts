
import sequelize from '../config/sequelize';
import { Client, Product, Purchase, PurchaseProduct } from '../models';
import { CreatePurchaseInput } from '../schemas/purchase.schema';


export async function createPurchase(input: CreatePurchaseInput) {

    const t = await sequelize.transaction();

    try {

        const client = await Client.findByPk(input.clientId, { transaction: t });
        if (!client) {
            throw new Error('Cliente não encontrado.');
        }


        const productIds = input.products.map((p) => p.productId);
        const productsFromDb = await Product.findAll({
            where: { id: productIds },
            transaction: t,
        });

        if (productsFromDb.length !== productIds.length) {
            throw new Error('Um ou mais produtos não foram encontrados.');
        }


        const totalPrice = input.products.reduce((total, currentProduct) => {
            const productData = productsFromDb.find(p => p.id === currentProduct.productId);

            return total + productData!.price * currentProduct.quantity;
        }, 0);


        const purchase = await Purchase.create(
            {
                clientId: input.clientId,
                totalPrice: totalPrice,
            },
            { transaction: t }
        );


        const purchaseProductsData = input.products.map((p) => ({
            purchaseId: purchase.id,
            productId: p.productId,
            quantity: p.quantity,
        }));


        await PurchaseProduct.bulkCreate(purchaseProductsData, { transaction: t });


        await t.commit();


        return findPurchaseById(purchase.id);

    } catch (error: any) {

        await t.rollback();

        throw error;
    }
}


export async function findPurchaseById(id: number) {
    return Purchase.findByPk(id, {
        include: [
            { model: Client, as: 'client' },
            { model: Product, as: 'products' },
        ],
    });
}


export async function findPurchasesByClientId(clientId: number) {
    return Purchase.findAll({
        where: { clientId },
        include: [{ model: Product, as: 'products' }],
    });
}