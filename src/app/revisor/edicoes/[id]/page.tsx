import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    FileText,
} from "lucide-react";

export default async function EventosRevisorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const revisorId = Number(cookieStore.get("submita_session")?.value);

    const edicao = await prisma.edicao.findUnique({
        where: { id: Number(id) },
        include: {
            eventos: {
                where: {
                    revisores: {
                        some: {
                            usuarioId: revisorId,
                        },
                    },
                },
                include: {
                    atribuicoes: {
                        where: {
                            revisorId,
                        },
                    },
                },
                orderBy: {
                    sigla: "asc",
                },
            },
        },
    });

    if (!edicao) {
        return (
            <main className="min-h-screen bg-slate-50 p-8">
                <p className="text-center font-bold text-red-500">
                    Edição não encontrada.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <Link
                        href="/revisor"
                        className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Voltar para Edições
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-ufla-blue text-white rounded-2xl shadow-lg">
                            <CalendarDays className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Edição {edicao.ano}
                            </h1>
                            <p className="text-slate-500 font-medium mt-2">
                                Selecione o evento para visualizar seus trabalhos.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {edicao.eventos.map((evento) => (
                        <Link
                            key={evento.id}
                            href={`/revisor/edicoes/${edicao.id}/eventos/${evento.id}`}
                            className="group bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm hover:border-ufla-blue hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <span className="bg-blue-50 text-ufla-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        {evento.titulo}
                                    </span>

                                    <h2 className="text-2xl font-black text-slate-800 mt-4 leading-tight">
                                        {evento.sigla}
                                    </h2>

                                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                                        <FileText className="w-4 h-4" />
                                        {evento.atribuicoes.length} trabalho(s) atribuído(s)
                                    </p>
                                </div>

                                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-ufla-blue group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}

                    {edicao.eventos.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                                Nenhum evento com trabalhos atribuídos nesta edição.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}