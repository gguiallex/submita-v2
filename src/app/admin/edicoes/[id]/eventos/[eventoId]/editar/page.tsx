import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EventNavbar } from '../components/EventNavbar';
import { ArrowLeft, Save, LayoutDashboard, PencilLine } from 'lucide-react';
import { editarEventoAction } from '../actions';

export default async function EditarEventoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) }
    });

    if (!evento) return notFound();

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                        <PencilLine className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Editar Evento
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 italic">Alterando configurações de {evento.sigla}</p>
                    </div>
                </div>
            </header>

            <EventNavbar
                edicaoId={id}
                eventoId={eventoId}
            />

            <form action={editarEventoAction} className="space-y-6">
                <input type="hidden" name="id" value={evento.id} />
                <input type="hidden" name="edicaoId" value={id} />

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                    {/* Sigla */}
                    <div className="space-y-2">
                        {/* CORREÇÃO: htmlFor vinculado ao id do input */}
                        <label
                            htmlFor="sigla-input"
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                        >
                            Sigla
                        </label>
                        <input
                            id="sigla-input"
                            name="sigla"
                            defaultValue={evento.sigla}
                            required
                            placeholder="Ex: XXXV CIUFLA"
                            title="Digite a sigla do evento"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                        />
                    </div>

                    {/* Título */}
                    <div className="space-y-2">
                        {/* CORREÇÃO: htmlFor vinculado ao id do input */}
                        <label
                            htmlFor="titulo-input"
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                        >
                            Título do Evento
                        </label>
                        <input
                            id="titulo-input"
                            name="titulo"
                            defaultValue={evento.titulo}
                            required
                            placeholder="Ex: Congresso de Iniciação Científica da UFLA"
                            title="Digite o título completo do evento"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                        />
                    </div>

                    {/* Configurações do Evento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="dataInicio-input"
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                            >
                                Data de Início
                            </label>
                            <input
                                id="dataInicio-input"
                                name="dataInicio"
                                type="date"
                                defaultValue={
                                    evento.dataInicio
                                        ? evento.dataInicio.toISOString().split("T")[0]
                                        : ""
                                }
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="dataFim-input"
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                            >
                                Data de Fim
                            </label>
                            <input
                                id="dataFim-input"
                                name="dataFim"
                                type="date"
                                defaultValue={
                                    evento.dataFim
                                        ? evento.dataFim.toISOString().split("T")[0]
                                        : ""
                                }
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="maxRevisoresPorTrabalho-input"
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                            >
                                Máx. Revisores por Trabalho
                            </label>
                            <input
                                id="maxRevisoresPorTrabalho-input"
                                name="maxRevisoresPorTrabalho"
                                type="number"
                                min={1}
                                defaultValue={evento.maxRevisoresPorTrabalho}
                                required
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="maxTrabalhosPorRevisor-input"
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                            >
                                Máx. Trabalhos por Revisor
                            </label>
                            <input
                                id="maxTrabalhosPorRevisor-input"
                                name="maxTrabalhosPorRevisor"
                                type="number"
                                min={1}
                                defaultValue={evento.maxTrabalhosPorRevisor}
                                required
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-900 font-bold focus:ring-2 focus:ring-ufla-blue transition-all"
                            />
                        </div>
                    </div>

                    {/* Regras de Submissão */}
                    <div className="border-t border-slate-100 pt-8">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
                            Regras de Submissão
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="exigirResumo"
                                    defaultChecked={evento.exigirResumo}
                                    className="w-5 h-5 accent-blue-700"
                                />
                                <span className="font-bold text-slate-700">
                                    Exigir resumo na submissão
                                </span>
                            </label>

                            <label className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="exigirPdf"
                                    defaultChecked={evento.exigirPdf}
                                    className="w-5 h-5 accent-blue-700"
                                />
                                <span className="font-bold text-slate-700">
                                    Exigir arquivo PDF
                                </span>
                            </label>

                            <label className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="submissaoAnonima"
                                    defaultChecked={evento.submissaoAnonima}
                                    className="w-5 h-5 accent-blue-700"
                                />
                                <span className="font-bold text-slate-700">
                                    Submissão anônima
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-ufla-blue text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}