
export interface Client {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface PurchaseProduct {
    id: number;
    name: string;
    price: number;
    PurchaseProduct: {
        quantity: number;
    }
}

export interface Purchase {
    id: number;
    total: number;
    createdAt: string;
    client: {
        id: number;
        name: string;
    };
    products: PurchaseProduct[];
}

export interface Address {
    id: number;
    street: string;
    number: string;
    city: string;
    state: string;
    clientId: number;
}