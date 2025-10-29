
import { Client, Product, Purchase } from '../models';
import { Sequelize, Op } from 'sequelize';

export async function getDashboardStats() {
    try {

        const [
            totalClients,
            totalProducts,
            totalPurchases,
            totalRevenue,
        ] = await Promise.all([
            Client.count(),
            Product.count(),
            Purchase.count(),
            Purchase.sum('totalPrice'),
        ]);


        return {
            totalClients,
            totalProducts,
            totalPurchases,

            totalRevenue: totalRevenue || 0,
        };
    } catch (error: any) {
        throw new Error(`Erro ao buscar estatísticas do dashboard: ${error.message}`);
    }
}