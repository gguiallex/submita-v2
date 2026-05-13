import prisma from '@/lib/prisma';
import Link from 'next/link';
import { NovaPerguntaForm } from "./NovaPerguntaForm";
import { EventNavbar } from '../components/EventNavbar';
import {
    ArrowLeft,
    Plus,
    Trash2,
    HelpCircle,
    BarChart3,
    FileText,
    Check,
    Settings2,
    ListChecks,
} from 'lucide-react';
import {
    adicionarPerguntaAction,
    removerPerguntaAction,
    editarPerguntaAction
} from './actions';

export default async function GestaoQuestionarioPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            perguntas: {
                orderBy: { ordem: 'asc' }
            }
        }
    });

    if (!evento) {
        return <div className="p-8 text-center font-bold text-red-500">Evento não encontrado</div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-ufla-blue text-white rounded-2xl shadow-lg shadow-blue-100">
                        <Settings2 className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Configurar Barema
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Gerencie as perguntas de avaliação do <span className="text-ufla-blue font-bold">{evento.sigla}</span>
                        </p>
                    </div>
                </div>
            </header>

            <EventNavbar edicaoId={id} eventoId={eventoId} />

            <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Plus className="w-3 h-3" strokeWidth={3} />
                        Novo Critério de Avaliação
                    </h2>

                    <NovaPerguntaForm eventoId={eventoId} edicaoId={id} />
                </div>
            </section>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Critérios Atuais ({evento.perguntas.length})
                    </h2>
                    <span className="text-[9px] font-bold text-slate-400 italic">
                        Passe o mouse para editar ou excluir
                    </span>
                </div>

                {evento.perguntas.map((p) => {
                    const isEscala = p.tipo === 'ESCALA';
                    const isMultipla = p.tipo === 'MULTIPLA_ESCOLHA';

                    return (
                        <div
                            key={p.id}
                            className="group bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-ufla-blue transition-all overflow-hidden"
                        >
                            <form action={editarPerguntaAction} className="p-6">
                                <input type="hidden" name="id" value={p.id} />
                                <input type="hidden" name="edicaoId" value={id} />
                                <input type="hidden" name="eventoId" value={eventoId} />

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1 flex items-start gap-5">
                                        <div
                                            className={`p-4 rounded-2xl shrink-0 ${
                                                isEscala
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : isMultipla
                                                        ? 'bg-purple-50 text-purple-600'
                                                        : 'bg-amber-50 text-amber-600'
                                            }`}
                                        >
                                            {isEscala ? (
                                                <BarChart3 className="w-6 h-6" />
                                            ) : isMultipla ? (
                                                <ListChecks className="w-6 h-6" />
                                            ) : (
                                                <FileText className="w-6 h-6" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <input
                                                name="texto"
                                                defaultValue={p.texto}
                                                title="Editar texto da pergunta"
                                                className="w-full bg-transparent border-b-2 border-transparent focus:border-ufla-blue outline-none font-black text-slate-800 tracking-tight text-xl transition-all py-1"
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <select
                                                    name="tipo"
                                                    defaultValue={p.tipo}
                                                    title="Alterar tipo"
                                                    className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-3 rounded-lg cursor-pointer border-none focus:ring-2 focus:ring-ufla-blue/20"
                                                >
                                                    <option value="ESCALA">Métrica (0-10)</option>
                                                    <option value="ABERTA">Parecer Texto</option>
                                                    <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                                </select>

                                                <input
                                                    name="opcoes"
                                                    defaultValue={p.opcoes || ''}
                                                    placeholder="Opções: Excelente;Bom;Regular"
                                                    title="Opções da múltipla escolha separadas por ponto e vírgula"
                                                    className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-3 rounded-lg border-none focus:ring-2 focus:ring-ufla-blue/20"
                                                />
                                            </div>

                                            {isMultipla && (
                                                <p className="text-[10px] font-bold text-purple-500">
                                                    Opções cadastradas: {p.opcoes || 'nenhuma opção definida'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        title="Salvar alterações"
                                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                        Salvar
                                    </button>
                                </div>
                            </form>

                            <div className="bg-slate-50 px-8 py-3 flex justify-between items-center border-t border-slate-100">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                    ID #{p.id}
                                </span>

                                <form action={removerPerguntaAction}>
                                    <input type="hidden" name="id" value={p.id} />
                                    <input type="hidden" name="edicaoId" value={id} />
                                    <input type="hidden" name="eventoId" value={eventoId} />

                                    <button
                                        type="submit"
                                        title="Excluir este critério definitivamente"
                                        className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Remover Critério
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                })}

                {evento.perguntas.length === 0 && (
                    <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                            Barema vazio. Adicione critérios acima para começar.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}