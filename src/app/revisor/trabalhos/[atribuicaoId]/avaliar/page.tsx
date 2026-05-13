import prisma from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowLeft,
    ClipboardCheck,
    CheckCircle2,
    FileText,
} from "lucide-react";
import { salvarAvaliacaoAction } from "./actions";

export default async function ResponderBaremaPage({
    params,
}: {
    params: Promise<{ atribuicaoId: string }>;
}) {
    const { atribuicaoId } = await params;

    const atribuicao = await prisma.atribuicao.findUnique({
        where: { id: Number(atribuicaoId) },
        include: {
            evento: {
                include: {
                    perguntas: {
                        orderBy: {
                            ordem: "asc",
                        },
                    },
                },
            },
            submissao: true,
        },
    });

    if (!atribuicao) {
        return (
            <p className="text-center font-bold text-red-500">
                Avaliação não encontrada.
            </p>
        );
    }

    const concluido = atribuicao.status === "CONCLUIDO";

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10">
                <Link
                    href={`/revisor/trabalhos/${atribuicao.id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Trabalho
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-ufla-blue text-white rounded-2xl shadow-lg">
                        <ClipboardCheck className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Responder Barema
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            Trabalho: {atribuicao.submissao.titulo}
                        </p>
                    </div>
                </div>
            </header>

            <section className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                {concluido && (
                    <div className="mb-8 flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        <CheckCircle2 className="w-4 h-4" />
                        Esta avaliação já foi concluída. Reenviar irá substituir as respostas anteriores.
                    </div>
                )}

                {atribuicao.evento.perguntas.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                            Este evento ainda não possui critérios de avaliação.
                        </p>
                    </div>
                ) : (
                    <form action={salvarAvaliacaoAction} className="space-y-6">
                        <input
                            type="hidden"
                            name="atribuicaoId"
                            value={atribuicao.id}
                        />

                        {atribuicao.evento.perguntas.map((pergunta) => (
                            <div
                                key={pergunta.id}
                                className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-3"
                            >
                                <label
                                    htmlFor={`pergunta-${pergunta.id}`}
                                    className="block text-sm font-black text-slate-700"
                                >
                                    {pergunta.texto}
                                </label>

                                {pergunta.tipo === "ESCALA" ? (
                                    <input
                                        id={`pergunta-${pergunta.id}`}
                                        name={`pergunta-${pergunta.id}`}
                                        type="number"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        required={pergunta.obrigatoria}
                                        placeholder="Nota de 0 a 10"
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-ufla-blue"
                                    />
                                ) : pergunta.tipo === "MULTIPLA_ESCOLHA" ? (
                                    <select
                                        id={`pergunta-${pergunta.id}`}
                                        name={`pergunta-${pergunta.id}`}
                                        required={pergunta.obrigatoria}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-ufla-blue"
                                    >
                                        <option value="">Selecione uma opção</option>

                                        {pergunta.opcoes
                                            ?.split(";")
                                            .map((opcao) => opcao.trim())
                                            .filter(Boolean)
                                            .map((opcao) => (
                                                <option key={opcao} value={opcao}>
                                                    {opcao}
                                                </option>
                                            ))}
                                    </select>
                                ) : (
                                    <textarea
                                        id={`pergunta-${pergunta.id}`}
                                        name={`pergunta-${pergunta.id}`}
                                        required={pergunta.obrigatoria}
                                        placeholder="Digite seu parecer..."
                                        rows={4}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-ufla-blue resize-none"
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="w-full bg-ufla-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-900 transition-all active:scale-95"
                        >
                            Enviar Avaliação
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
}