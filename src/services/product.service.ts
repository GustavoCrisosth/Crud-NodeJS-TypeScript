
import { Product } from '../models';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';


export async function createProduct(input: CreateProductInput) {
    try {
        const product = await Product.create(input);
        return product;
    } catch (error: any) {
        throw new Error(`Erro ao criar produto: ${error.message}`);
    }
}


export async function findAllProducts() {
    return Product.findAll();
}


export async function findProductById(id: number) {
    const product = await Product.findByPk(id);
    return product;
}


export async function updateProduct(id: number, input: UpdateProductInput) {
    const product = await findProductById(id);

    if (!product) {
        return null;
    }

    await product.update(input);
    return product;
}


export async function deleteProduct(id: number) {
    const product = await findProductById(id);

    if (!product) {
        return null;
    }

    await product.destroy();
    return product;
}