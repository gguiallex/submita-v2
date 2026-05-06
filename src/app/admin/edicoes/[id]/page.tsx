import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import {
    ArrowLeft,
    Copy,
    Plus,
    Settings2,
    Info,
    User as UserIcon,
    Tag,
    Eye,
    CalendarDays,
} from 'lucide-react';

import { BotoesAcao } from './BotoesAcao';
import { AcoesEvento } from './AcoesEvento';

export default async function EdicaoDetalhesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const edicaoIdAtual = Number(id);

    if (isNaN(edicaoIdAtual)) return notFound();

    async function copiarEventosAction(formData: FormData) {
        'use server';

        const origemId = Number(formData.get('origemId'));

        const eventosOrigem = await prisma.evento.findMany({
            where: { edicaoId: origemId },
            include: {
                temas: true,
                perguntas: true,
            },
        });

        if (eventosOrigem.length > 0) {
            for (const ev of eventosOrigem) {
                await prisma.evento.create({
                    data: {
                        titulo: ev.titulo,
                        sigla: ev.sigla,
                        adminId: ev.adminId,
                        edicaoId: edicaoIdAtual,

                        dataInicio: ev.dataInicio,
                        dataFim: ev.dataFim,
                        maxRevisoresPorTrabalho: ev.maxRevisoresPorTrabalho,
                        maxTrabalhosPorRevisor: ev.maxTrabalhosPorRevisor,
                        exigirResumo: ev.exigirResumo,
                        exigirPdf: ev.exigirPdf,
                        submissaoAnonima: ev.submissaoAnonima,

                        temas: {
                            connect: ev.temas.map((t) => ({ id: t.id })),
                        },

                        perguntas: {
                            create: ev.perguntas.map((p) => ({
                                texto: p.texto,
                                tipo: p.tipo,
                                obrigatoria: p.obrigatoria,
                                ordem: p.ordem,
                                opcoes: p.opcoes,
                            })),
                        },
                    },
                });
            }

            revalidatePath(`/admin/edicoes/${id}`);
        }
    }

    const edicao = await prisma.edicao.findUnique({
        where: { id: edicaoIdAtual },
        include: {
            eventos: {
                include: {
                    admin: true,
                    _count: {
                        select: {
                            submissoes: true,
                        },
                    },
                },
            },
        },
    });

    if (!edicao) return notFound();

    const outrasEdicoes = await prisma.edicao.findMany({
        where: {
            id: { not: edicaoIdAtual },
            eventos: { some: {} },
        },
        orderBy: {
            ano: 'desc',
        },
    });

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <Link
                        href="/admin/edicoes"
                        className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-3 hover:text-blue-900 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Painel de Edições
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="bg-ufla-blue p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
                            <CalendarDays className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Edição {edicao.ano}
                            </h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Eventos vinculados a esta edição acadêmica
                            </p>
                        </div>
                    </div>
                </div>

                <BotoesAcao edicaoId={edicao.id} />
            </header>

            <section className="space-y-8">
                {edicao.eventos.length === 0 && outrasEdicoes.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 p-4">
                            <Copy className="w-24 h-24 text-amber-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-amber-800 mb-2">
                                <Info className="w-5 h-5" />
                                <h3 className="font-black uppercase text-xs tracking-widest text-amber-600">
                                    Assistente de Configuração
                                </h3>
                            </div>

                            <p className="text-amber-900 font-bold text-lg tracking-tight">
                                Deseja replicar a estrutura de eventos?
                            </p>

                            <p className="text-amber-700/80 text-sm mt-1 font-medium">
                                Importe a listagem de eventos de um ano anterior para este ciclo.
                            </p>
                        </div>

                        <form action={copiarEventosAction} className="flex flex-col sm:flex-row gap-3 relative z-10">
                            <select
                                name="origemId"
                                title="Selecione a edição de origem para cópia"
                                className="p-4 border border-amber-200 rounded-2xl bg-white text-sm font-black text-amber-900 outline-none focus:ring-4 focus:ring-amber-500/10 transition-all min-w-[200px] cursor-pointer"
                            >
                                {outrasEdicoes.map((oe) => (
                                    <option key={oe.id} value={oe.id}>
                                        Ciclo {oe.ano}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition shadow-lg active:scale-95"
                            >
                                <Copy className="w-4 h-4" />
                                Importar Agora
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-ufla-blue" />

                            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
                                Gestão de Eventos
                            </h2>
                        </div>

                        <Link
                            href={`/admin/edicoes/${edicao.id}/novo-evento`}
                            className="group flex items-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 active:scale-95"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
                            Novo Evento
                        </Link>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Identificação
                                    </th>

                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Título e Responsável
                                    </th>

                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {edicao.eventos.map((evento) => (
                                    <tr
                                        key={evento.id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-50 text-ufla-blue rounded-xl">
                                                    <Tag className="w-5 h-5" />
                                                </div>

                                                <div>
                                                    <p className="font-black text-ufla-blue italic text-lg leading-none">
                                                        {evento.sigla}
                                                    </p>

                                                    <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                                        ID: #{evento.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <p className="font-black text-slate-700 tracking-tight text-lg">
                                                {evento.titulo}
                                            </p>

                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <UserIcon className="w-3 h-3" />

                                                    <span className="text-[11px] font-bold uppercase tracking-tight">
                                                        {evento.admin.nome}
                                                    </span>
                                                </div>

                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />

                                                <p className="text-[11px] text-slate-400 font-bold uppercase">
                                                    {evento._count.submissoes} Submissões
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/admin/edicoes/${id}/eventos/${evento.id}`}
                                                    title="Entrar no evento"
                                                    className="flex items-center gap-2 bg-ufla-blue text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-sm active:scale-95"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Entrar
                                                </Link>

                                                <AcoesEvento
                                                    eventoId={evento.id}
                                                    edicaoId={edicaoIdAtual}
                                                    sigla={evento.sigla}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {edicao.eventos.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Settings2 className="w-8 h-8 text-slate-200" />
                                </div>

                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                    Nenhum evento registrado para o ciclo {edicao.ano}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}