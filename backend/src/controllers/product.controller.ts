
import { Request, Response } from 'express';
import {
    createProduct,
    findAllProducts,
    findProductById,
    updateProduct,
    deleteProduct,
} from '../services/product.service';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';


export async function createProductHandler(
    req: Request<{}, {}, CreateProductInput>,
    res: Response
) {
    try {
        const product = await createProduct(req.body);
        return res.status(201).json(product);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function getAllProductsHandler(req: Request, res: Response) {
    try {
        const products = await findAllProducts();
        return res.status(200).json(products);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function getProductByIdHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const product = await findProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.status(200).json(product);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function updateProductHandler(
    req: Request<{ id: string }, {}, UpdateProductInput>,
    res: Response
) {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedProduct = await updateProduct(id, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}


export async function deleteProductHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const product = await findProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        await deleteProduct(id);
        return res.sendStatus(204);
    } catch (error: any) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}