
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import sequelize from './config/sequelize';
import clientRouter from './routes/client.routes';
import addressRouter from './routes/address.routes';
import productRouter from './routes/product.routes';
import purchaseRouter from './routes/purchase.routes';
import dashboardRouter from './routes/dashboard.routes';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/clients', clientRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/products', productRouter);
app.use('/api/purchases', purchaseRouter);
app.use('/api/dashboard', dashboardRouter);

const startServer = async () => {
    try {

        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');


        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
};

startServer();