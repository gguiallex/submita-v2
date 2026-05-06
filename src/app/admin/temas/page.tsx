import prisma from '@/lib/prisma';
import { Search, Tag, Plus, Trash2, Hash, Layers, Check, AlertCircle } from 'lucide-react';
import { salvarTemaGlobal, excluirTemaGlobal } from '../temas/actions';

export default async function TemasGlobaisPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; error?: string }>
}) {
    const { q, error } = await searchParams;

    const temas = await prisma.tema.findMany({
        where: {
            nome: {
                contains: q || '',
            }
        },
        orderBy: { nome: 'asc' },
        include: { _count: { select: { submissoes: true } } }
    });

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Cadastro Mestre
                    </h1>
                    <p className="text-slate-500 font-medium mt-3 text-lg">
                        Repositório global de Áreas Temáticas
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulário de Criação Rápida */}
                <aside className="h-fit space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Plus className="w-3 h-3" strokeWidth={3} />
                                Novo Tema Global
                            </h2>
                            <form action={salvarTemaGlobal} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="nome-tema-novo" className="hidden">Nome do Tema</label>
                                    <input
                                        id="nome-tema-novo"
                                        name="nome"
                                        required
                                        placeholder="Ex: Inteligência Artificial"
                                        className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 text-white font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-400 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-400 transition-all shadow-lg active:scale-95"
                                >
                                    Adicionar ao Repositório
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 italic text-[11px] text-amber-700 leading-relaxed">
                        <strong>Dica:</strong> Temas criados aqui estarão disponíveis para seleção em todos os eventos do sistema.
                    </div>
                </aside>

                {/* Listagem e Busca */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* EXIBIÇÃO DE ERRO (Aviso Amigável) */}
                    {error && (
                        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 text-red-600 rounded-3xl animate-in zoom-in duration-300">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {/* BARRA DE PESQUISA */}
                    <form method="GET" className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-ufla-blue transition-colors" />
                        <input 
                            name="q"
                            defaultValue={q}
                            placeholder="Pesquisar por nome da área..."
                            className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-14 pr-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-ufla-blue/10 focus:border-ufla-blue transition-all shadow-sm"
                        />
                    </form>

                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-slate-400" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {q ? `Resultados para "${q}"` : 'Todas as Áreas'} ({temas.length})
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {temas.map((tema) => (
                            <div
                                key={tema.id}
                                className="group bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-ufla-blue transition-all overflow-hidden"
                            >
                                <form action={salvarTemaGlobal} className="p-6 flex items-center justify-between gap-4">
                                    <input type="hidden" name="id" value={tema.id} />

                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-ufla-blue transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1">
                                            <input
                                                name="nome"
                                                defaultValue={tema.nome}
                                                aria-label="Editar nome do tema"
                                                className="w-full bg-transparent border-b-2 border-transparent focus:border-ufla-blue outline-none font-black text-slate-800 tracking-tight text-lg transition-all py-1"
                                            />
                                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                {tema._count.submissoes} Trabalhos vinculados
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        title="Confirmar alteração"
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                        Salvar
                                    </button>
                                </form>

                                <div className="bg-slate-50 px-8 py-2 flex justify-end border-t border-slate-100">
                                    <form action={async () => { 'use server'; await excluirTemaGlobal(tema.id); }}>
                                        <button
                                            type="submit"
                                            className="text-[9px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1"
                                            title="Excluir do banco mestre"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Excluir
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}

                        {temas.length === 0 && (
                            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Tag className="w-10 h-10 text-slate-300 mx-auto mb-4 opacity-50" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    {q ? 'Nenhuma área encontrada para esta busca.' : 'O repositório está vazio.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}