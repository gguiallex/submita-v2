import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import {
    ArrowLeft,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    ClipboardCheck,
    ChevronRight,
    Tag,
} from "lucide-react";

export default async function TrabalhosRevisorEventoPage({
    params,
}: {
    params: Promise<{ id: string; eventoId: string }>;
}) {
    const { id, eventoId } = await params;
    const cookieStore = await cookies();
    const revisorId = Number(cookieStore.get("submita_session")?.value);

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            edicao: true,
            atribuicoes: {
                where: {
                    revisorId,
                },
                include: {
                    submissao: {
                        include: {
                            autores: true,
                            temas: true,
                        },
                    },
                },
                orderBy: {
                    dataAtribuicao: "desc",
                },
            },
        },
    });

    if (!evento) {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <p className="text-center font-bold text-red-500">
                    Evento não encontrado.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <Link
                        href={`/revisor/edicoes/${id}`}
                        className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Voltar para Eventos
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="bg-blue-50 text-ufla-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                {evento.sigla}
                            </span>

                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mt-4">
                                Trabalhos para Avaliação
                            </h1>

                            <p className="text-slate-500 font-medium mt-2 text-lg">
                                {evento.titulo}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Total atribuído
                            </p>
                            <p className="text-3xl font-black text-ufla-blue leading-none">
                                {evento.atribuicoes.length}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-5">
                    {evento.atribuicoes.map((atribuicao) => {
                        const submissao = atribuicao.submissao;
                        const concluido = atribuicao.status === "CONCLUIDO";

                        return (
                            <article
                                key={atribuicao.id}
                                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:border-ufla-blue hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                Trabalho #{submissao.id}
                                            </span>

                                            <span
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${concluido
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                                    }`}
                                            >
                                                {concluido ? (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                ) : (
                                                    <AlertCircle className="w-3 h-3" />
                                                )}
                                                {concluido ? "Concluído" : "Pendente"}
                                            </span>

                                            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                Atribuído em{" "}
                                                {atribuicao.dataAtribuicao.toLocaleDateString(
                                                    "pt-BR"
                                                )}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                                            {submissao.titulo}
                                        </h2>

                                        {!evento.submissaoAnonima && (
                                            <div className="flex flex-wrap gap-2">
                                                {submissao.autores.map((autor) => (
                                                    <span
                                                        key={autor.id}
                                                        className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600"
                                                    >
                                                        {autor.nome}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {evento.submissaoAnonima && (
                                            <p className="text-xs font-bold text-slate-400 italic">
                                                Autoria ocultada por regra de submissão anônima.
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {submissao.temas.map((tema) => (
                                                <span
                                                    key={tema.id}
                                                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-ufla-blue/70 italic"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tema.nome}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-3 lg:w-56">
                                        <Link
                                            href={`/revisor/trabalhos/${atribuicao.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Visualizar
                                        </Link>

                                        <Link
                                            href={`/revisor/trabalhos/${atribuicao.id}/avaliar`}
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${concluido
                                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                    : "bg-slate-900 text-white hover:bg-ufla-blue"
                                                }`}
                                        >
                                            <ClipboardCheck className="w-4 h-4" />
                                            {concluido ? "Ver Barema" : "Responder"}
                                            <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}

                    {evento.atribuicoes.length === 0 && (
                        <div className="py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                                Nenhum trabalho atribuído para você neste evento.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}