import prisma from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    Download,
    User,
    Tag,
    ClipboardCheck,
} from "lucide-react";

export default async function VisualizarTrabalhoPage({
    params,
}: {
    params: Promise<{ atribuicaoId: string }>;
}) {
    const { atribuicaoId } = await params;

    const atribuicao = await prisma.atribuicao.findUnique({
        where: { id: Number(atribuicaoId) },
        include: {
            evento: true,
            submissao: {
                include: {
                    autores: true,
                    temas: true,
                },
            },
        },
    });

    if (!atribuicao) {
        return (
            <p className="text-center font-bold text-red-500">
                Trabalho não encontrado.
            </p>
        );
    }

    const { evento, submissao } = atribuicao;

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-10">
                <Link
                    href={`/revisor/edicoes/${evento.edicaoId}/eventos/${evento.id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Trabalhos
                </Link>

                <span className="bg-blue-50 text-ufla-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {evento.sigla}
                </span>

                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mt-4">
                    Visualizar Trabalho
                </h1>
            </header>

            <article className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        <FileText className="w-6 h-6" />
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Trabalho #{submissao.id}
                        </p>

                        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {submissao.titulo}
                        </h2>
                    </div>
                </div>

                {evento.exigirResumo && submissao.resumo && (
                    <section className="mb-8">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Resumo
                        </h3>

                        <p className="text-sm leading-relaxed text-slate-600 font-medium">
                            {submissao.resumo}
                        </p>
                    </section>
                )}

                {!evento.submissaoAnonima ? (
                    <section className="mb-8">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Autores
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {submissao.autores.map((autor) => (
                                <span
                                    key={autor.id}
                                    className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600"
                                >
                                    <User className="w-3 h-3" />
                                    {autor.nome}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : (
                    <p className="mb-8 text-xs font-bold text-slate-400 italic">
                        Autoria ocultada por regra de submissão anônima.
                    </p>
                )}

                <section className="mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Áreas temáticas
                    </h3>

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
                </section>

                <div className="flex flex-col sm:flex-row gap-3">
                    {evento.exigirPdf && submissao.arquivoUrl && (
                        <a
                            href={`/uploads/${submissao.arquivoUrl}`}
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-ufla-blue transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Visualizar PDF
                        </a>
                    )}

                    <Link
                        href={`/revisor/trabalhos/${atribuicao.id}/avaliar`}
                        className="inline-flex items-center justify-center gap-2 bg-ufla-blue text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-900 transition-all"
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Responder Barema
                    </Link>
                </div>
            </article>
        </div>
    );
}