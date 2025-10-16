

import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Client, Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { useToast } from '../hooks/use-toast';
import { ClientComboBox } from '../components/ClientComboBox';
import { ProductComboBox } from '../components/ProductComboBox';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface CartItem extends Product {
    quantity: number;
}

export default function NewPurchasePage() {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [clientsResponse, productsResponse] = await Promise.all([
                    api.get('/clients'),
                    api.get('/products'),
                ]);
                setClients(clientsResponse.data);
                setProducts(productsResponse.data);
            } catch (err) {
                setError('Falha ao carregar os dados iniciais para a compra.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const newTotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        setTotalPrice(newTotal);
    }, [cartItems]);

    const handleAddToCart = () => {
        if (!selectedProductId) {
            toast({ variant: "destructive", title: "Atenção", description: "Selecione um produto para adicionar." });
            return;
        }
        const productToAdd = products.find(p => p.id === selectedProductId);
        if (!productToAdd) return;

        const existingItem = cartItems.find(item => item.id === selectedProductId);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === selectedProductId ? { ...item, quantity: item.quantity + quantity } : item
            ));
        } else {
            setCartItems([...cartItems, { ...productToAdd, quantity }]);
        }
    };

    const handleFinalizePurchase = async () => {
        if (!selectedClientId) {
            toast({ variant: "destructive", title: "Atenção", description: "Por favor, selecione um cliente." });
            return;
        }
        if (cartItems.length === 0) {
            toast({ variant: "destructive", title: "Atenção", description: "O carrinho está vazio. Adicione pelo menos um produto." });
            return;
        }
        const purchaseData = {
            clientId: selectedClientId,
            products: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };
        try {
            await api.post('/purchases', purchaseData);
            toast({ title: "Sucesso!", description: "Compra registrada com sucesso." });
            navigate('/');
        } catch (error) {
            const description = error instanceof AxiosError ? "Erro da API ao registrar a compra." : "Ocorreu um erro inesperado.";
            toast({ variant: "destructive", title: "Falha ao registrar a compra", description });
            console.error(error);
        }
    };

    if (loading) return <p className="text-center mt-8">Carregando dados...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Registrar Nova Compra</h1>
                <Button onClick={handleFinalizePurchase}>Finalizar Compra</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="p-6 bg-card border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">1. Selecione o Cliente</h2>
                        <ClientComboBox clients={clients} value={selectedClientId} onChange={setSelectedClientId} />
                    </div>
                    <div className="p-6 bg-card border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">2. Adicione Produtos</h2>
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <Label htmlFor="product-selector">Produto</Label>
                                <ProductComboBox products={products} value={selectedProductId} onChange={setSelectedProductId} />
                            </div>
                            <div className="w-24">
                                <Label htmlFor="quantity">Quantidade</Label>
                                <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} />
                            </div>
                            <Button onClick={handleAddToCart}>Adicionar</Button>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-card border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">3. Resumo da Compra</h2>
                    <div className="space-y-2">
                        {cartItems.length === 0 ? (
                            <p className="text-muted-foreground">Nenhum item no carrinho.</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</span>
                                </div>
                            ))
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <>
                            <hr className="my-4 border-border" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}