
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import type { Client } from '../types';
import { AxiosError } from 'axios';
import { MoreHorizontal } from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function ClientsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newClientName, setNewClientName] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingEmail, setEditingEmail] = useState('');

    const fetchClients = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (err) {
            setError('Falha ao carregar os clientes. Verifique se a API está no ar.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (clientToEdit) {
            setEditingName(clientToEdit.name);
            setEditingEmail(clientToEdit.email);
        }
    }, [clientToEdit]);

    const handleCreateClient = async () => {
        if (!newClientName || !newClientEmail) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Por favor, preencha nome e e-mail." });
            return;
        }
        try {
            await api.post('/clients', { name: newClientName, email: newClientEmail });
            toast({ title: "Sucesso!", description: "Cliente cadastrado com sucesso." });
            setNewClientName('');
            setNewClientEmail('');
            setIsCreateDialogOpen(false);
            await fetchClients();
        } catch (error) {
            const description = error instanceof AxiosError && error.response?.status === 409 ? 'Este e-mail já está cadastrado.' : 'Ocorreu um erro inesperado.';
            toast({ variant: "destructive", title: "Falha ao criar cliente", description });
            console.error(error);
        }
    };

    const handleDeleteClient = async () => {
        if (!clientToDelete) return;
        try {
            await api.delete(`/clients/${clientToDelete.id}`);
            toast({ title: "Sucesso!", description: `Cliente "${clientToDelete.name}" excluído com sucesso.` });
            setClientToDelete(null);
            await fetchClients();
        } catch (error) {
            toast({ variant: "destructive", title: "Falha ao excluir cliente", description: "Ocorreu um erro ao tentar excluir o cliente." });
            console.error(error);
        }
    };

    const handleUpdateClient = async () => {
        if (!clientToEdit) return;
        if (!editingName || !editingEmail) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "Nome e e-mail não podem ficar vazios." });
            return;
        }
        try {
            await api.patch(`/clients/${clientToEdit.id}`, { name: editingName, email: editingEmail });
            toast({ title: "Sucesso!", description: "Cliente atualizado com sucesso." });
            setClientToEdit(null);
            await fetchClients();
        } catch (error) {
            const description = error instanceof AxiosError && error.response?.status === 409 ? 'Este e-mail já está cadastrado em outro cliente.' : 'Ocorreu um erro inesperado.';
            toast({ variant: "destructive", title: "Falha ao atualizar cliente", description });
            console.error(error);
        }
    };

    if (loading) return <p className="text-center mt-8">Carregando...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild><Button>Adicionar Cliente</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Adicionar Novo Cliente</DialogTitle><DialogDescription>Preencha os dados abaixo.</DialogDescription></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Nome</Label><Input id="name" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="col-span-3" /></div>
                            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} className="col-span-3" /></div>
                        </div>
                        <DialogFooter><DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose><Button onClick={handleCreateClient}>Salvar</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-right">Ações</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-muted/50">
                                <td className="px-6 py-4 whitespace-nowrap">{client.id}</td><td className="px-6 py-4 whitespace-nowrap font-medium">{client.name}</td><td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{client.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => navigate(`/clients/${client.id}`)}>Ver Endereços</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setClientToEdit(client)}>Editar Cliente</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10" onSelect={() => setClientToDelete(client)}>Excluir Cliente</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá excluir permanentemente o cliente <span className="font-bold"> "{clientToDelete?.name}"</span>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteClient}>Sim, excluir</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!clientToEdit} onOpenChange={() => setClientToEdit(null)}>
                <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Editar Cliente</DialogTitle><DialogDescription>Altere os dados abaixo e clique em salvar.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-name" className="text-right">Nome</Label><Input id="edit-name" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-email" className="text-right">Email</Label><Input id="edit-email" type="email" value={editingEmail} onChange={(e) => setEditingEmail(e.target.value)} className="col-span-3" /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setClientToEdit(null)}>Cancelar</Button><Button onClick={handleUpdateClient}>Salvar Alterações</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}