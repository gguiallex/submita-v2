import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Tag, CheckCircle2, Settings2, Search, Layers } from 'lucide-react';
import { EventNavbar } from '../components/EventNavbar';
import { vincularTemaAction } from './actions';

export default async function VincularTemasEventoPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string, eventoId: string }>,
    searchParams: Promise<{ q?: string }>
}) {
    const { id, eventoId } = await params;
    const { q } = await searchParams;

    const todosOsTemas = await prisma.tema.findMany({
        where: { nome: { contains: q || '' } },
        orderBy: { nome: 'asc' }
    });

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: { temas: true }
    });

    if (!evento) return <div className="p-8 text-center font-bold text-red-500">Evento não encontrado</div>;

    const temasVinculadosIds = evento.temas.map(t => t.id);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Evento
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Áreas do Evento
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Ative os eixos temáticos para o <span className="text-ufla-blue font-bold">{evento.sigla}</span>
                        </p>
                    </div>

                    <Link
                        href="/admin/temas"
                        className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ufla-blue hover:text-white transition-all shadow-sm"
                    >
                        <Settings2 className="w-4 h-4" />
                        Gerenciar Cadastro Mestre
                    </Link>
                </div>
            </header>

            <EventNavbar
                edicaoId={id}
                eventoId={eventoId}
            />

            <div className="mb-8 relative group">
                <form method="GET" className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-ufla-blue transition-colors" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Pesquisar tema para vincular..."
                        className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-14 pr-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-ufla-blue/10 focus:border-ufla-blue transition-all shadow-sm"
                    />
                </form>
            </div>

            <form action={vincularTemaAction} className="space-y-8">
                <input type="hidden" name="eventoId" value={eventoId} />
                <input type="hidden" name="edicaoId" value={id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-32">
                    {todosOsTemas.map((tema) => {
                        const estaVinculado = temasVinculadosIds.includes(tema.id);
                        return (
                            <div key={tema.id}>
                                {/* O SEGREDO: O input checkbox controla o estilo do label abaixo dele via 'peer' */}
                                <input
                                    type="checkbox"
                                    name="temasIds"
                                    id={`tema-${tema.id}`}
                                    value={tema.id}
                                    defaultChecked={estaVinculado}
                                    className="peer hidden"
                                />
                                <label
                                    htmlFor={`tema-${tema.id}`}
                                    className="relative flex items-center justify-between p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-200 bg-white border-slate-100 shadow-sm hover:border-slate-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:shadow-lg peer-checked:shadow-emerald-100 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 transition-colors peer-checked:group-[]:bg-emerald-500 peer-checked:group-[]:text-white">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-black uppercase text-sm tracking-tight block text-slate-700 peer-checked:group-[]:text-emerald-900">
                                                {tema.nome}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                Clique para alternar
                                            </span>
                                        </div>
                                    </div>
                                    {/* Mostra o ícone de Check apenas quando o input irmão está checado */}
                                    <div className="text-emerald-500 opacity-0 transition-opacity peer-checked:group-[]:opacity-100">
                                        <CheckCircle2 className="w-7 h-7 fill-white" />
                                    </div>
                                </label>
                            </div>
                        );
                    })}
                </div>

                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button
                        type="submit"
                        className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-ufla-blue transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-4"
                    >
                        Salvar Configuração de Áreas
                    </button>
                </div>
            </form>
        </div>
    );
}