
import { Link, Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            { }
            <header className="bg-card border-b border-border sticky top-0 z-10">
                <nav className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-lg font-bold">
                        Crisosth App
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/clients" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Clientes
                        </Link>
                        <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Produtos
                        </Link>
                        <Link to="/purchases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Histórico
                        </Link>
                        <Link to="/purchases/new" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Nova Compra
                        </Link>
                        { }
                    </div>
                </nav>
            </header>

            { }
            <main className="flex-1">
                { }
                <Outlet />
            </main>

            <Toaster /> { }
        </div>
    );
}