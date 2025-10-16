
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { StatCard } from '../components/StatCard';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';


interface DashboardStats {
    totalClients: number;
    totalProducts: number;
    totalPurchases: number;
    totalRevenue: number;
}

export default function HomePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (err) {
                setError('Falha ao carregar os dados do dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="text-center mt-8">Carregando dashboard...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!stats) return <p className="text-center mt-8">Nenhum dado para exibir.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total de Vendas"
                    value={stats.totalPurchases}
                    icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Receita Total"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue)}
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Clientes Cadastrados"
                    value={stats.totalClients}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Produtos no Catálogo"
                    value={stats.totalProducts}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            { }
        </div>
    );
}