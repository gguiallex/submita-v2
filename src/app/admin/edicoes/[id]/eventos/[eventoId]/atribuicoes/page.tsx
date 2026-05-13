import prisma from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowLeft,
    UserCheck,
    Users,
    Mail,
    Trash2,
    FileText,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import {
    atribuirRevisorAction,
    removerAtribuicaoAction,
    atribuirAutomaticamenteAction,
} from "./actions";
import { EventNavbar } from "../components/EventNavbar";

export default async function AtribuicoesPage({
    params,
}: {
    params: Promise<{ id: string; eventoId: string }>;
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            submissoes: {
                include: {
                    autores: true,
                    temas: true,
                    atribuicoes: {
                        include: {
                            revisor: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            revisores: {
                include: {
                    usuario: true,
                    temas: true,
                },
            },
        },
    });

    if (!evento) {
        return (
            <div className="p-8 text-center font-bold text-red-500">
                Evento não encontrado
            </div>
        );
    }

    const emailsRevisores = Array.from(
        new Set(
            evento.submissoes.flatMap((submissao) =>
                submissao.atribuicoes.map(
                    (atribuicao) => atribuicao.revisor.email
                )
            )
        )
    );

    const mailtoUrl = `mailto:${emailsRevisores.join(",")}?subject=${encodeURIComponent(
        `Avaliação de trabalhos - ${evento.sigla}`
    )}&body=${encodeURIComponent(
        `Olá!\n\nVocê recebeu trabalhos para avaliação no evento ${evento.sigla}.\n\nPor favor, acesse o sistema Submita para visualizar e avaliar os trabalhos atribuídos.\n\nAtenciosamente,\nEquipe Submita`
    )}`;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-100">
                            <UserCheck className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Atribuição de Trabalhos
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Distribua os trabalhos do{" "}
                                <span className="text-ufla-blue font-bold">
                                    {evento.sigla}
                                </span>{" "}
                                entre os revisores.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <form action={atribuirAutomaticamenteAction}>
                            <input type="hidden" name="edicaoId" value={id} />
                            <input type="hidden" name="eventoId" value={eventoId} />

                            <button
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all shadow-lg active:scale-95"
                            >
                                Gerar automaticamente
                            </button>
                        </form>

                        {emailsRevisores.length > 0 ? (
                            <a
                                href={mailtoUrl}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                            >
                                <Mail className="w-4 h-4" />
                                Enviar e-mail
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-400 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed"
                            >
                                <Mail className="w-4 h-4" />
                                Nenhum revisor atribuído
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <EventNavbar edicaoId={id} eventoId={eventoId} />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Máx. revisores por trabalho
                    </p>
                    <p className="text-3xl font-black text-orange-600">
                        {evento.maxRevisoresPorTrabalho}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Máx. trabalhos por revisor
                    </p>
                    <p className="text-3xl font-black text-orange-600">
                        {evento.maxTrabalhosPorRevisor}
                    </p>
                </div>
            </section>

            <div className="space-y-6">
                {evento.submissoes.map((submissao) => {
                    const totalAtribuidos = submissao.atribuicoes.length;
                    const atingiuLimite =
                        totalAtribuidos >= evento.maxRevisoresPorTrabalho;

                    return (
                        <article
                            key={submissao.id}
                            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
                                            Trabalho #{submissao.id}
                                        </span>

                                        <span
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${atingiuLimite
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}
                                        >
                                            {atingiuLimite ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <AlertCircle className="w-3 h-3" />
                                            )}
                                            {totalAtribuidos}/
                                            {evento.maxRevisoresPorTrabalho} revisores
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

                                    <div className="flex flex-wrap gap-2">
                                        {submissao.temas.map((tema) => (
                                            <span
                                                key={tema.id}
                                                className="text-[9px] font-black uppercase tracking-widest text-ufla-blue/60 italic"
                                            >
                                                #{tema.nome}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Revisores atribuídos
                                        </h3>

                                        {submissao.atribuicoes.length > 0 ? (
                                            <div className="space-y-3">
                                                {submissao.atribuicoes.map(
                                                    (atribuicao) => (
                                                        <div
                                                            key={atribuicao.id}
                                                            className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
                                                        >
                                                            <div>
                                                                <p className="font-black text-slate-700 text-sm">
                                                                    {atribuicao.revisor.nome}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                                    {atribuicao.revisor.email} • {atribuicao.status}
                                                                </p>
                                                            </div>

                                                            <form
                                                                action={
                                                                    removerAtribuicaoAction
                                                                }
                                                            >
                                                                <input
                                                                    type="hidden"
                                                                    name="edicaoId"
                                                                    value={id}
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    name="eventoId"
                                                                    value={
                                                                        eventoId
                                                                    }
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    name="atribuicaoId"
                                                                    value={
                                                                        atribuicao.id
                                                                    }
                                                                />

                                                                <button
                                                                    type="submit"
                                                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Remover
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs font-bold text-slate-400 italic">
                                                Nenhum revisor atribuído ainda.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <aside className="lg:w-80 bg-slate-50 border border-slate-100 rounded-[2rem] p-5 h-fit">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        Atribuir novo revisor
                                    </h3>

                                    {atingiuLimite ? (
                                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-xs font-bold">
                                            Este trabalho já atingiu o limite de
                                            revisores.
                                        </div>
                                    ) : evento.revisores.length === 0 ? (
                                        <div className="bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl p-4 text-xs font-bold">
                                            Nenhum revisor foi vinculado a este
                                            evento.
                                        </div>
                                    ) : (
                                        <form
                                            action={atribuirRevisorAction}
                                            className="space-y-4"
                                        >
                                            <input
                                                type="hidden"
                                                name="edicaoId"
                                                value={id}
                                            />
                                            <input
                                                type="hidden"
                                                name="eventoId"
                                                value={eventoId}
                                            />
                                            <input
                                                type="hidden"
                                                name="submissaoId"
                                                value={submissao.id}
                                            />

                                            <select
                                                name="revisorId"
                                                required
                                                title="Selecione um revisor"
                                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-ufla-blue"
                                            >
                                                <option value="">
                                                    Selecione um revisor
                                                </option>

                                                {evento.revisores.map(
                                                    (rev) => (
                                                        <option
                                                            key={rev.id}
                                                            value={
                                                                rev.usuario.id
                                                            }
                                                        >
                                                            {rev.usuario.nome}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                                Atribuir Revisor
                                            </button>
                                        </form>
                                    )}
                                </aside>
                            </div>
                        </article>
                    );
                })}

                {evento.submissoes.length === 0 && (
                    <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Nenhum trabalho submetido para este evento ainda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}