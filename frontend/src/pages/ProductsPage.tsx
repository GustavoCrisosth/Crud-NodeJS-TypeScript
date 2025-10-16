

import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Product } from '../types';
import { AxiosError } from 'axios';
import { MoreHorizontal } from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function ProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingPrice, setEditingPrice] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Falha ao carregar os produtos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateProduct = async () => {
        if (!newProductName || !newProductPrice) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Nome e Preço são obrigatórios." });
            return;
        }
        try {
            await api.post('/products', {
                name: newProductName,
                price: parseFloat(newProductPrice),
                description: newProductDescription,
            });
            toast({ title: "Sucesso!", description: "Produto cadastrado com sucesso." });
            setNewProductName('');
            setNewProductPrice('');
            setNewProductDescription('');
            setIsCreateDialogOpen(false);
            await fetchProducts();
        } catch (error) {
            const description = error instanceof AxiosError ? "Erro da API ao criar produto." : "Ocorreu um erro inesperado.";
            toast({ variant: "destructive", title: "Falha ao criar produto", description });
            console.error(error);
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await api.delete(`/products/${productToDelete.id}`);
            toast({ title: "Sucesso!", description: `Produto "${productToDelete.name}" excluído com sucesso.` });
            setProductToDelete(null);
            await fetchProducts();
        } catch (error) {
            const description = error instanceof AxiosError ? "Erro da API ao excluir produto." : "Ocorreu um erro inesperado.";
            toast({ variant: "destructive", title: "Falha ao excluir produto", description });
            console.error(error);
        }
    };

    useEffect(() => {
        if (productToEdit) {
            setEditingName(productToEdit.name);
            setEditingPrice(String(productToEdit.price));
            setEditingDescription(productToEdit.description || '');
        }
    }, [productToEdit]);

    const handleUpdateProduct = async () => {
        if (!productToEdit) return;
        if (!editingName || !editingPrice) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Nome e Preço são obrigatórios." });
            return;
        }
        try {
            await api.patch(`/products/${productToEdit.id}`, {
                name: editingName,
                price: parseFloat(editingPrice),
                description: editingDescription,
            });
            toast({ title: "Sucesso!", description: "Produto atualizado com sucesso." });
            setProductToEdit(null);
            await fetchProducts();
        } catch (error) {
            const description = error instanceof AxiosError ? "Erro da API ao atualizar produto." : "Ocorreu um erro inesperado.";
            toast({ variant: "destructive", title: "Falha ao atualizar produto", description });
            console.error(error);
        }
    };

    if (loading) return <p className="text-center mt-8">Carregando...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild><Button>Adicionar Produto</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader><DialogTitle>Adicionar Novo Produto</DialogTitle><DialogDescription>Preencha os dados abaixo.</DialogDescription></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Nome</Label><Input id="name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="col-span-3" /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Preço</Label><Input id="price" type="number" placeholder="ex: 19.99" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="col-span-3" /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Descrição</Label><Input id="description" value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} className="col-span-3" /></div>
                        </div>
                        <DialogFooter><DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose><Button onClick={handleCreateProduct}>Salvar</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => setProductToEdit(product)}>Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10" onSelect={() => setProductToDelete(product)}>Excluir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá excluir permanentemente o produto <span className="font-bold"> "{productToDelete?.name}"</span>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteProduct}>Sim, excluir</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!productToEdit} onOpenChange={() => setProductToEdit(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader><DialogTitle>Editar Produto</DialogTitle><DialogDescription>Altere os dados abaixo e clique em salvar.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-name" className="text-right">Nome</Label><Input id="edit-name" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-price" className="text-right">Preço</Label><Input id="edit-price" type="number" value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-description" className="text-right">Descrição</Label><Input id="edit-description" value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} className="col-span-3" /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setProductToEdit(null)}>Cancelar</Button><Button onClick={handleUpdateProduct}>Salvar Alterações</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}