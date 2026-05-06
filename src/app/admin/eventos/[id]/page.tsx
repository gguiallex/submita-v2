import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function DetalhesEventoAdmin({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const eventoIdNum = Number(id);

    // 1. Buscamos o evento incluindo Temas e Submissões (com seus temas)
    const evento = await prisma.evento.findUnique({
        where: { id: eventoIdNum },
        include: {
            temas: true,
            submissoes: {
                include: { tema: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!evento) notFound();

    // 2. Action para criar novo tema
    async function criarTema(formData: FormData) {
        'use server'
        const nome = formData.get('nome') as string;

        await prisma.tema.create({
            data: {
                nome,
                eventoId: eventoIdNum
            }
        });

        revalidatePath(`/admin/eventos/${id}`);
    }

    // Cálculos para o Relatório (Dia 27)
    const totalSubmissoes = evento.submissoes.length;
    const aprovados = evento.submissoes.filter(s => s.status === 'APROVADO').length;
    const reprovados = evento.submissoes.filter(s => s.status === 'REPROVADO').length;
    const aguardando = evento.submissoes.filter(s => s.status === 'SUBMETIDO').length;
    const mediaGeral = totalSubmissoes > 0
        ? (evento.submissoes.reduce((acc, s) => acc + s.mediaFinal, 0) / totalSubmissoes).toFixed(1)
        : "0.0";

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-ufla-blue tracking-tight uppercase italic">
                    {evento.sigla}
                </h1>
                <p className="text-slate-500 font-medium">{evento.titulo}</p>
            </header>

            {/* Dashboard de Relatório Rápido - DIA 27 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aprovados</p>
                    <p className="text-3xl font-black text-emerald-600 mt-1">{aprovados}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reprovados</p>
                    <p className="text-3xl font-black text-red-600 mt-1">{reprovados}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-ufla-blue">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Média Geral</p>
                    <p className="text-3xl font-black text-ufla-blue mt-1">{mediaGeral}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-amber-400">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando</p>
                    <p className="text-3xl font-black text-amber-500 mt-1">{aguardando}</p>
                </div>
            </div>

            {/* Gestão de Temas */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-12">
                <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-ufla-green rounded-full"></span>
                    Áreas Temáticas
                </h2>

                <div className="flex flex-wrap gap-2 mb-6">
                    {evento.temas.length === 0 && (
                        <p className="text-sm text-slate-400 italic">Nenhum tema cadastrado para este evento.</p>
                    )}
                    {evento.temas.map(tema => (
                        <span key={tema.id} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 uppercase tracking-wider">
                            {tema.nome}
                        </span>
                    ))}
                </div>

                <form action={criarTema} className="flex gap-2">
                    <input
                        name="nome"
                        placeholder="Ex: Inteligência Artificial"
                        className="flex-1 border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-ufla-blue transition-all"
                        required
                    />
                    <button type="submit" className="bg-ufla-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-md active:scale-95">
                        Adicionar Área
                    </button>
                </form>
            </section>

            {/* LISTAGEM DE TRABALHOS (SUBMISSÕES) */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Trabalhos Submetidos</h2>
                    <span className="bg-slate-800 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        {totalSubmissoes} Total
                    </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-6">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-5 text-xs font-bold uppercase text-slate-400 tracking-widest">Título do Artigo</th>
                                <th className="p-5 text-xs font-bold uppercase text-slate-400 tracking-widest">Área Temática</th>
                                <th className="p-5 text-xs font-bold uppercase text-slate-400 tracking-widest">Média</th>
                                <th className="p-5 text-xs font-bold uppercase text-slate-400 tracking-widest">Status</th>
                                <th className="p-5 text-xs font-bold uppercase text-slate-400 tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {totalSubmissoes === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-slate-400 italic font-medium">
                                        Nenhum trabalho enviado até o momento.
                                    </td>
                                </tr>
                            ) : (
                                evento.submissoes.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5">
                                            <p className="font-bold text-slate-800 group-hover:text-ufla-blue transition-colors line-clamp-1">{sub.titulo}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-tighter">Protocolo: #SUB-{sub.id.toString().padStart(4, '0')}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase">
                                                {sub.tema?.nome || 'Geral'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700">
                                                    {sub.mediaFinal > 0 ? sub.mediaFinal.toFixed(2) : "---"}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Nota Final</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${sub.status === 'APROVADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    sub.status === 'REPROVADO' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <a
                                                href={`/admin/submissoes/${sub.id}`}
                                                className="text-ufla-blue font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                                            >
                                                {sub.mediaFinal > 0 ? 'Reavaliar' : 'Avaliar'}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}