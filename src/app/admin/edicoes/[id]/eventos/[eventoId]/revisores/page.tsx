import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Building2,
    Trash2,
    Users,
    Tag,
} from 'lucide-react';
import {
    adicionarRevisorAction,
    removerRevisorEventoAction,
} from './actions';
import { EventNavbar } from '../components/EventNavbar';

export default async function RevisoresEventoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            temas: {
                orderBy: { nome: 'asc' },
            },
            revisores: {
                include: {
                    usuario: {
                        include: {
                            departamento: true,
                        },
                    },
                    temas: true,
                },
                orderBy: {
                    usuario: {
                        nome: 'asc',
                    },
                },
            },
        },
    });

    const departamentos = await prisma.departamento.findMany({
        orderBy: { sigla: 'asc' },
    });

    if (!evento) {
        return (
            <div className="p-8 text-center font-bold text-red-500">
                Evento não encontrado
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}/eventos/${eventoId}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Evento
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-100">
                        <Users className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Revisores do Evento
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Gerencie o corpo de revisores vinculado ao{' '}
                            <span className="text-ufla-blue font-bold">
                                {evento.sigla}
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            <EventNavbar edicaoId={id} eventoId={eventoId} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {evento.revisores.map((revisor) => (
                        <div
                            key={revisor.id}
                            className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:border-purple-400 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-black italic text-xl uppercase">
                                        {revisor.usuario.nome.charAt(0)}
                                    </div>

                                    <div>
                                        <h3 className="font-black text-slate-800 uppercase tracking-tight">
                                            {revisor.usuario.nome}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {revisor.usuario.email}
                                            </span>

                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {revisor.usuario.departamento?.sigla || 'Sem departamento'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {revisor.temas.length > 0 ? (
                                                revisor.temas.map((tema) => (
                                                    <span
                                                        key={tema.id}
                                                        className="flex items-center gap-1 bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                                                    >
                                                        <Tag className="w-3 h-3" />
                                                        {tema.nome}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400 italic">
                                                    Nenhuma área temática vinculada.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <form action={removerRevisorEventoAction}>
                                    <input type="hidden" name="revisorEventoId" value={revisor.id} />
                                    <input type="hidden" name="eventoId" value={eventoId} />
                                    <input type="hidden" name="edicaoId" value={id} />

                                    <button
                                        type="submit"
                                        title="Remover Revisor"
                                        aria-label={`Remover revisor ${revisor.usuario.nome}`}
                                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Remover
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}

                    {evento.revisores.length === 0 && (
                        <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                Nenhum revisor vinculado a este evento.
                            </p>
                        </div>
                    )}
                </div>

                <aside className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <UserPlus className="w-6 h-6 text-purple-300" />
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">
                            Novo Revisor
                        </h2>
                    </div>

                    <form action={adicionarRevisorAction} className="space-y-5">
                        <input type="hidden" name="eventoId" value={eventoId} />
                        <input type="hidden" name="edicaoId" value={id} />

                        <div>
                            <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-2 block">
                                Nome Completo
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                required
                                placeholder="Nome do revisor"
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-purple-400 transition-all text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-2 block">
                                E-mail Institucional
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="email@ufla.br"
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-purple-400 transition-all text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="departamentoId" className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-2 block">
                                Departamento
                            </label>
                            <select
                                id="departamentoId"
                                name="departamentoId"
                                required
                                defaultValue=""
                                className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-purple-400 transition-all text-white appearance-none"
                            >
                                <option value="" disabled className="text-slate-900">
                                    Selecione...
                                </option>

                                {departamentos.map((departamento) => (
                                    <option
                                        key={departamento.id}
                                        value={departamento.id}
                                        className="text-slate-900"
                                    >
                                        {departamento.sigla}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-3">
                                Áreas de Especialidade
                            </p>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {evento.temas.length > 0 ? (
                                    evento.temas.map((tema) => (
                                        <label
                                            key={tema.id}
                                            className="flex items-center gap-3 bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/15 transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                name="temasIds"
                                                value={tema.id}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <span className="text-xs font-bold text-white">
                                                {tema.nome}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 font-bold">
                                        Cadastre áreas temáticas no evento antes de vincular especialidades.
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg mt-4 active:scale-95"
                        >
                            Adicionar Revisor
                        </button>
                    </form>
                </aside>
            </div>
        </div>
    );
}