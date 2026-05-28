import prisma from '@/lib/prisma';
import Link from 'next/link';
import { EventNavbar } from '../components/EventNavbar';
import {
    ArrowLeft,
    FileSearch,
    FileText,
    User,
    Download,
    Clock,
    CheckCircle2,
    ChevronRight,
    Search
} from 'lucide-react';

export default async function TrabalhosEventoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            submissoes: {
                include: { autores: true, temas: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!evento) return <div className="p-8 text-center font-bold text-red-500">Evento não encontrado</div>;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-100">
                        <FileSearch className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Trabalhos Recebidos
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Listagem de submissões para o <span className="text-ufla-blue font-bold">{evento.sigla}</span>
                        </p>
                    </div>
                </div>
            </header>

            <EventNavbar
                edicaoId={id}
                eventoId={eventoId}
            />

            {/* Lista de Submissões */}
            <div className="space-y-4">
                {evento.submissoes.map((submissao) => (
                    <div
                        key={submissao.id}
                        className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-amber-500 transition-all"
                    >
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            {/* Conteúdo Principal */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                        #{submissao.id}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            Submetido em {submissao.createdAt.toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                                    {submissao.titulo}
                                </h2>

                                {/* Autores */}
                                <div className="flex flex-wrap gap-3">
                                    {submissao.autores.map((autor) => (
                                        <div key={autor.id} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <User className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-600">{autor.nome}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Áreas Temáticas (Chips Mini) */}
                                <div className="flex gap-2">
                                    {submissao.temas.map((tema) => (
                                        <span key={tema.id} className="text-[9px] font-black uppercase tracking-widest text-ufla-blue/60 italic">
                                            #{tema.nome}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Ações Laterais */}
                            <div className="flex flex-row lg:flex-col justify-end gap-3 min-w-[220px]">
                                <Link
                                    href={`/admin/edicoes/${id}/eventos/${eventoId}/trabalhos/${submissao.id}`}
                                    className="group flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white py-5 px-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.18em] hover:from-ufla-blue hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                        <FileText className="w-4 h-4" />
                                    </div>

                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] text-white/60 font-bold tracking-widest">
                                            Abrir submissão
                                        </span>
                                        <span className="text-xs font-black uppercase">
                                            Visualizar Trabalho
                                        </span>
                                    </div>

                                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {evento.submissoes.length === 0 && (
                    <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Nenhum trabalho submetido para este evento ainda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}