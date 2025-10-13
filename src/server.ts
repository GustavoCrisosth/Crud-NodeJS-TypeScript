
import express from 'express';
import 'dotenv/config';
import sequelize from './config/sequelize';
import clientRouter from './routes/client.routes';
import addressRouter from './routes/address.routes';
import productRouter from './routes/product.routes';
import purchaseRouter from './routes/purchase.routes';

const app = express();
const PORT = process.env.APP_PORT || 3000;


app.use(express.json());


app.use('/api/clients', clientRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/products', productRouter);
app.use('/api/purchases', purchaseRouter);

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