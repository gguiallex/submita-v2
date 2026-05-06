import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DetalheEdicaoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const edicao = await prisma.edicao.findUnique({
        where: { id: Number(id) },
        include: { 
            eventos: {
                include: { _count: { select: { submissoes: true } } }
            } 
        }
    });

    if (!edicao) notFound();

    return (
        <div className="min-h-screen bg-white py-16 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <Link href="/edicoes" className="text-ufla-blue font-black text-[10px] uppercase tracking-widest hover:underline">
                        ← Voltar para Edições
                    </Link>
                    <h1 className="text-5xl font-black text-slate-900 mt-4 tracking-tighter uppercase italic">
                        Eventos de {edicao.ano}
                    </h1>
                </header>

                <div className="space-y-4">
                    {edicao.eventos.map((evento) => (
                        <div key={evento.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-ufla-blue transition-all group">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{evento.titulo}</h3>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-ufla-blue font-black text-[10px] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                                        {evento.sigla}
                                    </span>
                                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        {evento._count.submissoes} Trabalhos Submetidos
                                    </span>
                                </div>
                            </div>

                            <Link 
                                href={`/edicoes/${id}/eventos/${evento.id}/submeter`}
                                className="mt-6 md:mt-0 bg-ufla-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all active:scale-95 text-center"
                            >
                                Submeter Trabalho
                            </Link>
                        </div>
                    ))}

                    {edicao.eventos.length === 0 && (
                        <p className="text-slate-400 italic">Nenhum evento cadastrado para este ano.</p>
                    )}
                </div>
            </div>
        </div>
    );
}