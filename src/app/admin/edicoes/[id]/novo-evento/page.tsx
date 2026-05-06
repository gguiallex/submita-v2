import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function NovoEventoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const edicaoId = Number(id);

    // Buscamos os usuários para selecionar o Administrador do evento
    const usuarios = await prisma.usuario.findMany();

    async function criarEventoAction(formData: FormData) {
        'use server';
        const titulo = formData.get('titulo') as string;
        const sigla = formData.get('sigla') as string;
        const adminId = Number(formData.get('adminId'));

        await prisma.evento.create({
            data: {
                titulo,
                sigla,
                adminId,
                edicaoId,
            }
        });

        revalidatePath(`/admin/edicoes/${id}`);
        redirect(`/admin/edicoes/${id}`);
    }

    return (
        <div className="max-w-xl mx-auto p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-ufla-blue uppercase italic">Novo Evento</h1>
                <p className="text-slate-500 font-medium">Cadastre um evento científico para esta edição.</p>
            </header>

            <form action={criarEventoAction} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <div>
                    <label className="block text-sm font-black text-slate-800 mb-2 uppercase">Título do Evento</label>
                    <input name="titulo" type="text" placeholder="Ex: Congresso de Iniciação Científica" className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue text-slate-800" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-black text-slate-800 mb-2 uppercase">Sigla</label>
                        <input name="sigla" type="text" placeholder="Ex: CIUFLA" className="text-slate-800 w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-slate-800 mb-2 uppercase">Responsável</label>
                        <select name="adminId" className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-ufla-blue bg-white text-slate-800" required>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-ufla-green text-white py-4 rounded-2xl font-black uppercase hover:bg-green-700 transition shadow-lg shadow-green-100">
                        Salvar Evento
                    </button>
                    <a href={`/admin/edicoes/${id}`} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-center hover:bg-slate-200 transition">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    );
}