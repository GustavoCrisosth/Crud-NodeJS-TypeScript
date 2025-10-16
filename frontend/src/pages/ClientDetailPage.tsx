

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import type { Client, Address } from '../types';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';


import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    const [client, setClient] = useState<Client | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({ street: '', number: '', city: '', state: '' });


    const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
    const [editingAddress, setEditingAddress] = useState({ street: '', number: '', city: '', state: '' });


    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

    const fetchClientDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [clientResponse, addressesResponse] = await Promise.all([
                api.get(`/clients/${id}`),
                api.get(`/addresses?clientId=${id}`),
            ]);
            setClient(clientResponse.data);
            setAddresses(addressesResponse.data);
        } catch (err) {
            setError('Falha ao carregar os detalhes do cliente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientDetails();
    }, [id]);

    const handleCreateAddress = async () => {
        if (!id || !newAddress.street || !newAddress.city || !newAddress.state) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Rua, cidade e estado são obrigatórios." });
            return;
        }
        try {
            await api.post('/addresses', { ...newAddress, clientId: parseInt(id) });
            toast({ title: "Sucesso!", description: "Endereço cadastrado com sucesso." });
            setIsCreateDialogOpen(false);
            setNewAddress({ street: '', number: '', city: '', state: '' });
            await fetchClientDetails();
        } catch (error) {
            toast({ variant: "destructive", title: "Falha ao cadastrar endereço", description: "Ocorreu um erro inesperado." });
            console.error(error);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewAddress(prevState => ({ ...prevState, [id]: value }));
    };

    useEffect(() => {
        if (addressToEdit) {
            setEditingAddress({
                street: addressToEdit.street,
                number: addressToEdit.number,
                city: addressToEdit.city,
                state: addressToEdit.state,
            });
        }
    }, [addressToEdit]);

    const handleDeleteAddress = async () => {
        if (!addressToDelete) return;
        try {
            await api.delete(`/addresses/${addressToDelete.id}`);
            toast({ title: "Sucesso!", description: "Endereço excluído com sucesso." });
            setAddressToDelete(null);
            await fetchClientDetails();
        } catch (error) {
            toast({ variant: "destructive", title: "Falha ao excluir endereço", description: "Ocorreu um erro inesperado." });
            console.error(error);
        }
    };

    const handleUpdateAddress = async () => {
        if (!addressToEdit) return;
        try {
            await api.patch(`/addresses/${addressToEdit.id}`, editingAddress);
            toast({ title: "Sucesso!", description: "Endereço atualizado com sucesso." });
            setAddressToEdit(null);
            await fetchClientDetails();
        } catch (error) {
            toast({ variant: "destructive", title: "Falha ao atualizar endereço", description: "Ocorreu um erro inesperado." });
            console.error(error);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditingAddress(prevState => ({ ...prevState, [id.replace('edit-', '')]: value }));
    };

    if (loading) return <p className="text-center mt-8">Carregando...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!client) return <p className="text-center mt-8">Cliente não encontrado.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft size={16} /> Voltar para a lista de clientes
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <p className="text-muted-foreground">{client.email}</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Endereços</h2>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild><Button>Adicionar Endereço</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader><DialogTitle>Adicionar Novo Endereço</DialogTitle><DialogDescription>Preencha os dados para {client.name}.</DialogDescription></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="street" className="text-right">Rua</Label><Input id="street" value={newAddress.street} onChange={handleFormChange} className="col-span-3" /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="number" className="text-right">Número</Label><Input id="number" value={newAddress.number} onChange={handleFormChange} className="col-span-3" /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="city" className="text-right">Cidade</Label><Input id="city" value={newAddress.city} onChange={handleFormChange} className="col-span-3" /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="state" className="text-right">Estado</Label><Input id="state" value={newAddress.state} onChange={handleFormChange} className="col-span-3" maxLength={2} /></div>
                            </div>
                            <DialogFooter><DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose><Button onClick={handleCreateAddress}>Salvar</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {addresses.length === 0 ? (
                    <p className="text-muted-foreground p-4 border rounded-lg bg-card">Nenhum endereço cadastrado para este cliente.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rua</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Número</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cidade</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-right">Ações</th></tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {addresses.map((address) => (
                                    <tr key={address.id}>
                                        <td className="px-6 py-4">{address.street}</td><td className="px-6 py-4">{address.number}</td><td className="px-6 py-4">{address.city}</td><td className="px-6 py-4">{address.state}</td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => setAddressToEdit(address)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10" onSelect={() => setAddressToDelete(address)}>Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AlertDialog open={!!addressToDelete} onOpenChange={() => setAddressToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá excluir permanentemente este endereço.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setAddressToDelete(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAddress}>Sim, excluir</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!addressToEdit} onOpenChange={() => setAddressToEdit(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader><DialogTitle>Editar Endereço</DialogTitle><DialogDescription>Altere os dados abaixo e clique em salvar.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-street" className="text-right">Rua</Label><Input id="edit-street" value={editingAddress.street} onChange={handleEditFormChange} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-number" className="text-right">Número</Label><Input id="edit-number" value={editingAddress.number} onChange={handleEditFormChange} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-city" className="text-right">Cidade</Label><Input id="edit-city" value={editingAddress.city} onChange={handleEditFormChange} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-state" className="text-right">Estado</Label><Input id="edit-state" value={editingAddress.state} onChange={handleEditFormChange} className="col-span-3" maxLength={2} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setAddressToEdit(null)}>Cancelar</Button><Button onClick={handleUpdateAddress}>Salvar Alterações</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}