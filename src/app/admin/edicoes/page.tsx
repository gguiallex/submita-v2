import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Trash2, ChevronRight, Layers, LayoutGrid } from 'lucide-react';

export default async function EdicoesPage() {
    // Busca as edições e conta quantos eventos cada uma tem
    const edicoes = await prisma.edicao.findMany({
        include: { 
            _count: { 
                select: { eventos: true } 
            } 
        },
        orderBy: { 
            ano: 'desc' 
        }
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cabeçalho de Ações */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-ufla-blue mb-2">
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Dashboard Geral</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Edições
                    </h1>
                    <p className="text-slate-500 font-medium mt-3">
                        Gerencie os ciclos anuais de submissão e eventos institucionais da UFLA.
                    </p>
                </div>

                <Link
                    href="/admin/edicoes/nova"
                    className="group flex items-center gap-2 bg-ufla-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={3} />
                    Abrir Novo Ano
                </Link>
            </header>

            {/* Grid de Edições */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {edicoes.length === 0 ? (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50">
                        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Nenhum ciclo acadêmico iniciado
                        </p>
                    </div>
                ) : (
                    edicoes.map((edicao) => (
                        <div 
                            key={edicao.id} 
                            className="group bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-ufla-blue transition-all relative overflow-hidden"
                        >
                            {/* Ano Estético (Watermark) */}
                            <div className="absolute -right-4 -bottom-8 text-slate-50 font-black text-[12rem] group-hover:text-slate-100/80 transition-colors z-0 pointer-events-none select-none">
                                {edicao.ano}
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                                            Ciclo Ativo
                                        </span>
                                        <h2 className="text-4xl font-black text-slate-800 mt-2">{edicao.ano}</h2>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Eventos</p>
                                        <p className="text-4xl font-black text-ufla-blue leading-none">
                                            {edicao._count.eventos}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-16 flex gap-3">
                                    <Link
                                        href={`/admin/edicoes/${edicao.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-ufla-blue transition-all shadow-lg shadow-slate-200 group/btn"
                                    >
                                        Gerenciar Ciclo
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}