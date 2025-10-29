

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import type { Client } from '../types';
import { AxiosError } from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientFormSchema, type ClientFormData } from '../schemas/clientFormSchema';


import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'; // Certifique-se que o 'form' foi adicionado com 'npx shadcn@latest add form'

export default function ClientsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingEmail, setEditingEmail] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const createForm = useForm<ClientFormData>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: { name: '', email: '' },
    });

    const fetchClients = async () => {
        setError(null); setLoading(true);
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (err) {
            setError('Falha ao carregar os clientes.'); console.error(err);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchClients(); }, []);

    useEffect(() => {
        if (clientToEdit) { setEditingName(clientToEdit.name); setEditingEmail(clientToEdit.email); }
    }, [clientToEdit]);

    const onSubmitCreate = async (data: ClientFormData) => {
        try {
            await api.post('/clients', data);
            toast({ title: "Sucesso!", description: "Cliente cadastrado." });
            setIsCreateDialogOpen(false); createForm.reset(); await fetchClients();
        } catch (error) {
            const description = error instanceof AxiosError && error.response?.status === 409 ? 'E-mail já cadastrado.' : 'Erro inesperado.';
            toast({ variant: "destructive", title: "Falha", description }); console.error(error);
        }
    };

    const handleDeleteClient = async () => {
        if (!clientToDelete) return;
        try {
            await api.delete(`/clients/${clientToDelete.id}`);
            toast({ title: "Sucesso!", description: `Cliente "${clientToDelete.name}" excluído.` });
            setClientToDelete(null); await fetchClients();
        } catch (error) {
            toast({ variant: "destructive", title: "Falha", description: "Erro ao excluir." }); console.error(error);
        }
    };

    const handleUpdateClient = async () => {
        if (!clientToEdit || !editingName || !editingEmail) {
            toast({ variant: "destructive", title: "Erro", description: "Campos obrigatórios." }); return;
        }
        try {
            await api.patch(`/clients/${clientToEdit.id}`, { name: editingName, email: editingEmail });
            toast({ title: "Sucesso!", description: "Cliente atualizado." });
            setClientToEdit(null); await fetchClients();
        } catch (error) {
            const description = error instanceof AxiosError && error.response?.status === 409 ? 'E-mail já cadastrado.' : 'Erro inesperado.';
            toast({ variant: "destructive", title: "Falha", description }); console.error(error);
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
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader><DialogTitle>Adicionar Novo Cliente</DialogTitle><DialogDescription>Preencha os dados.</DialogDescription></DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4 py-4">
                                <FormField control={createForm.control} name="name" render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Nome</FormLabel>
                                        <FormControl><Input placeholder="Nome" {...field} className="col-span-3" /></FormControl>
                                        <FormMessage className="col-span-4 text-right" />
                                    </FormItem>
                                )} />
                                <FormField control={createForm.control} name="email" render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="email@exemplo.com" {...field} className="col-span-3" /></FormControl>
                                        <FormMessage className="col-span-4 text-right" />
                                    </FormItem>
                                )} />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                    <Button type="submit" disabled={createForm.formState.isSubmitting}>
                                        {createForm.formState.isSubmitting ? "Salvando..." : "Salvar"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
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
                                    { }
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
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Excluir cliente <span className="font-bold"> "{clientToDelete?.name}"</span>?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteClient}>Sim, excluir</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!clientToEdit} onOpenChange={() => setClientToEdit(null)}>
                <DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Editar Cliente</DialogTitle><DialogDescription>Altere os dados.</DialogDescription></DialogHeader>
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