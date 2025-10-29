
import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Purchase } from '../types';

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await api.get('/purchases');
                setPurchases(response.data);
            } catch (err) {
                setError('Falha ao carregar o histórico de compras.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) return <p className="text-center mt-8">Carregando histórico...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Histórico de Compras</h1>

            {purchases.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-card">
                    <p className="text-muted-foreground">Nenhuma compra registrada ainda.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {purchases.map((purchase) => (
                        <div key={purchase.id} className="p-4 bg-card border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold text-lg">Compra #{purchase.id}</h2>
                                <span className="font-mono text-sm text-muted-foreground">
                                    {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Cliente:</span> {purchase.client.name}
                            </p>
                            <hr className="my-2 border-border" />
                            <ul className="text-sm space-y-1">
                                {purchase.products.map(p => (
                                    <li key={p.id} className="flex justify-between">
                                        <span>{p.PurchaseProduct.quantity}x {p.name}</span>
                                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price * p.PurchaseProduct.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            <hr className="my-2 border-border" />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.totalPrice)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}