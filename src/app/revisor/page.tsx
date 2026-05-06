import prisma from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, ChevronRight, ClipboardCheck } from "lucide-react";
import { cookies } from "next/headers";

export default async function RevisorHomePage() {

    const cookieStore = await cookies();
    const revisorId = Number(cookieStore.get("submita_session")?.value);

    const edicoes = await prisma.edicao.findMany({
        where: {
            eventos: {
                some: {
                    atribuicoes: {
                        some: {
                            revisorId,
                        },
                    },
                },
            },
        },
        include: {
            eventos: {
                where: {
                    atribuicoes: {
                        some: {
                            revisorId,
                        },
                    },
                },
                include: {
                    _count: {
                        select: {
                            atribuicoes: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            ano: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-ufla-blue text-white rounded-2xl shadow-lg">
                            <ClipboardCheck className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Portal do Revisor
                            </h1>
                            <p className="text-slate-500 font-medium mt-2">
                                Selecione uma edição para visualizar seus trabalhos.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {edicoes.map((edicao) => (
                        <Link
                            key={edicao.id}
                            href={`/revisor/edicoes/${edicao.id}`}
                            className="group bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm hover:border-ufla-blue hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-ufla-blue mb-3">
                                        <CalendarDays className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            Edição
                                        </span>
                                    </div>

                                    <h2 className="text-5xl font-black text-slate-900">
                                        {edicao.ano}
                                    </h2>

                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">
                                        {edicao.eventos.length} evento(s) com avaliações
                                    </p>
                                </div>

                                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-ufla-blue group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}

                    {edicoes.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                                Nenhuma avaliação atribuída até o momento.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}