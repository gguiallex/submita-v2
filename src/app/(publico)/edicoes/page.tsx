import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function ListaEdicoesPage() {
    // Buscamos todas as edições (anos) cadastradas
    const edicoes = await prisma.edicao.findMany({
        orderBy: { ano: 'desc' },
        include: { _count: { select: { eventos: true } } }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-ufla-blue font-black text-[10px] uppercase tracking-widest hover:underline">
                        ← Voltar para tela inicial
                    </Link>
                <header className="mb-12 text-center">
                    <span className="text-ufla-blue font-black uppercase tracking-[0.3em] text-xs">Universidade Federal de Lavras</span>
                    
                    <h1 className="text-5xl font-black text-slate-900 mt-4 tracking-tighter uppercase italic leading-none">
                        Ciclos Acadêmicos
                    </h1>
                    <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">
                        Selecione o ano de referência para visualizar os congressos, simpósios e realizar a submissão de trabalhos.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {edicoes.map((edicao) => (
                        <Link 
                            key={edicao.id} 
                            href={`/edicoes/${edicao.id}`}
                            className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-ufla-blue transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Detalhe estético de fundo */}
                            <div className="absolute -right-4 -top-4 text-slate-50 font-black text-9xl group-hover:text-blue-50 transition-colors">
                                {edicao.ano}
                            </div>

                            <div className="relative z-10">
                                <span className="bg-ufla-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    Inscrições Abertas
                                </span>
                                <h2 className="text-4xl font-black text-slate-800 mt-6 mb-2 tracking-tighter">
                                    {edicao.ano}
                                </h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    {edicao._count.eventos} Eventos Disponíveis
                                </p>
                                
                                <div className="mt-8 flex items-center text-ufla-blue font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                    Ver Eventos <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {edicoes.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum ciclo acadêmico encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}