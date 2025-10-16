
import { Router } from 'express';
import { getDashboardStatsHandler } from '../controllers/dashboard.controller';

const dashboardRouter = Router();

dashboardRouter.get('/', getDashboardStatsHandler);

export default dashboardRouter;