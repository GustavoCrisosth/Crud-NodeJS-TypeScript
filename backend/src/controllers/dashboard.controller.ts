
import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service';

export async function getDashboardStatsHandler(req: Request, res: Response) {
    try {
        const stats = await getDashboardStats();
        return res.status(200).json(stats);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno ao buscar estatísticas.' });
    }
}