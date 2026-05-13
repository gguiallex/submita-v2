import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    FileText,
    User,
    Mail,
    Building2,
    Download,
    Tag,
    Calendar,
    Layers,
    Info,
    ExternalLink
} from 'lucide-react';

export default async function DetalhesSubmissaoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string, submissaoId: string }>
}) {
    const { id, eventoId, submissaoId } = await params;

    // Procura a submissão garantindo que trazemos os autores, temas e os dados do evento pai
    const submissao = await prisma.submissao.findUnique({
        where: { id: Number(submissaoId) },
        include: {
            autores: {
                include: {
                    departamento: true
                }
            },
            temas: true,
            evento: true
        }
    });

    if (!submissao) return notFound();

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header com Navegação e Ação Principal */}
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}/eventos/${eventoId}/trabalhos`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Listagem
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-ufla-blue uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    Submissão #{submissao.id}
                                </span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    {submissao.status}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mt-2 leading-none">
                                Visualização do Artigo
                            </h1>
                        </div>
                    </div>

                    {submissao.evento.exigirPdf && submissao.arquivoUrl && (
                        <a
                            href={`/uploads/${submissao.arquivoUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-ufla-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Coluna da Esquerda: O Trabalho Científico */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Conteúdo Principal */}
                    <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-8 opacity-[0.03] pointer-events-none">
                            <FileText className="w-64 h-64 text-slate-900" />
                        </div>

                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <Info className="w-3 h-3 text-ufla-blue" />
                            Informações da Submissão
                        </h2>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-800 leading-[1.1] tracking-tight">
                                    {submissao.titulo}
                                </h3>
                            </div>

                            {submissao.evento.exigirResumo && submissao.resumo && (
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                        Resumo Acadêmico
                                    </p>
                                    <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
                                        "{submissao.resumo}"
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Palavras-Chave</p>
                                    <p className="text-slate-800 font-bold tracking-tight">{submissao.palavrasChave}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Layers className="w-3 h-3" /> Eixos Temáticos
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {submissao.temas.map(tema => (
                                            <span key={tema.id} className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 uppercase tracking-tighter">
                                                {tema.nome}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Coluna da Direita: Autores e Contexto Institucional */}
                <div className="space-y-8">

                    {/* Card de Contexto do Evento */}
                    <section className="bg-ufla-blue text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Tag className="w-32 h-32 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em] mb-1">Evento Vinculado</p>
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter">{submissao.evento.sigla}</h4>
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Calendar className="w-4 h-4 text-ufla-gold" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Data de Submissão</p>
                                    <p className="font-bold text-sm">{submissao.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lista de Autores Estilizada */}
                    {!submissao.evento.submissaoAnonima ? (
                        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <User className="w-3 h-3 text-ufla-blue" />
                                Corpo de Autores
                            </h2>

                            <div className="space-y-8">
                                {submissao.autores.map((autor, idx) => (
                                    <div key={autor.id} className="group relative pl-8 border-l-2 border-slate-100 hover:border-ufla-blue transition-colors">
                                        <div className="absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-ufla-blue transition-colors shadow-sm" />

                                        <div className="flex flex-col">
                                            <p className="font-black text-slate-800 text-sm uppercase tracking-tight leading-none group-hover:text-ufla-blue transition-colors">
                                                {autor.nome}
                                            </p>
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold tracking-tight">
                                                        {autor.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Building2 className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter leading-none">
                                                        {autor.departamento?.sigla}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {idx === 0 && (
                                            <span className="absolute right-0 top-0 text-[8px] font-black bg-blue-50 text-ufla-blue border border-blue-100 px-1.5 py-0.5 rounded uppercase">
                                                Relator
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-200 shadow-sm">
                            <h2 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Submissão Anônima
                            </h2>

                            <p className="text-sm font-bold text-amber-700 leading-relaxed">
                                Este evento está configurado para submissão anônima. As informações dos autores estão ocultas nesta visualização.
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}