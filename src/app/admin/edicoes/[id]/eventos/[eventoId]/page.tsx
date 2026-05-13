import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EventNavbar } from './components/EventNavbar';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    BarChart3,
    Calendar,
    Users,
    ListTree,
    ClipboardCheck,
    UserCheck,
    Settings2,
} from 'lucide-react';

export default async function VisaoGeralEventoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            _count: {
                select: {
                    submissoes: true,
                    perguntas: true,
                    temas: true,
                    revisores: true,
                    atribuicoes: true,
                }
            },
            submissoes: {
                include: {
                    respostas: true,
                    atribuicoes: true,
                }
            },
            temas: {
                include: {
                    _count: {
                        select: { submissoes: true }
                    }
                }
            }
        }
    });

    if (!evento) return notFound();

    const totalSubmissoes = evento._count.submissoes;
    const avaliados = evento.submissoes.filter(s => s.respostas.length > 0).length;
    const pendentes = totalSubmissoes - avaliados;
    const taxaAvaliacao = totalSubmissoes > 0 ? Math.round((avaliados / totalSubmissoes) * 100) : 0;

    const trabalhosSemRevisor = evento.submissoes.filter(
        (submissao) => submissao.atribuicoes.length === 0
    ).length;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {evento.sigla}
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-lg">
                            {evento.titulo}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                        <Calendar className="w-4 h-4 text-ufla-blue" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                            Edição {id}
                        </span>
                    </div>
                </div>
            </header>

            <EventNavbar edicaoId={id} eventoId={eventoId} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total de Trabalhos" value={totalSubmissoes} icon={<FileText />} color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Avaliados" value={avaliados} icon={<CheckCircle2 />} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Pendentes" value={pendentes} icon={<AlertCircle />} color="text-amber-600" bg="bg-amber-50" />
                <StatCard label="Progresso" value={`${taxaAvaliacao}%`} icon={<TrendingUp />} color="text-indigo-600" bg="bg-indigo-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-ufla-blue" />
                            Distribuição por Área
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {evento.temas.length > 0 ? (
                            evento.temas.map((tema) => {
                                const porcentagem = totalSubmissoes > 0
                                    ? (tema._count.submissoes / totalSubmissoes) * 100
                                    : 0;

                                return (
                                    <div key={tema.id}>
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                            <span className="text-slate-600">{tema.nome}</span>
                                            <span className="text-ufla-blue">
                                                {tema._count.submissoes}
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-ufla-blue h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${porcentagem}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm font-bold text-slate-400 italic">
                                Nenhuma área temática vinculada ao evento.
                            </p>
                        )}
                    </div>
                </section>

                <aside className="space-y-6">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                        Resumo da Estrutura
                    </h2>

                    <MiniInfoCard
                        label="Áreas temáticas"
                        value={evento._count.temas}
                        icon={<ListTree />}
                    />

                    <MiniInfoCard
                        label="Revisores vinculados"
                        value={evento._count.revisores}
                        icon={<Users />}
                    />

                    <MiniInfoCard
                        label="Critérios no barema"
                        value={evento._count.perguntas}
                        icon={<ClipboardCheck />}
                    />

                    <MiniInfoCard
                        label="Atribuições realizadas"
                        value={evento._count.atribuicoes}
                        icon={<UserCheck />}
                    />

                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                                <Settings2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Regras do Evento
                                </p>
                                <p className="text-sm font-black text-slate-700">
                                    Configurações atuais
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs font-bold text-slate-500">
                            <p>Resumo: {evento.exigirResumo ? 'obrigatório' : 'opcional'}</p>
                            <p>PDF: {evento.exigirPdf ? 'obrigatório' : 'opcional'}</p>
                            <p>Anonimato: {evento.submissaoAnonima ? 'sim' : 'não'}</p>
                            <p>Trabalhos sem revisor: {trabalhosSemRevisor}</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, bg }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </p>
                <p className={`text-3xl font-black ${color}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

function MiniInfoCard({ label, value, icon }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </p>
                <p className="text-3xl font-black text-slate-800">
                    {value}
                </p>
            </div>

            <div className="p-3 bg-slate-50 text-ufla-blue rounded-xl">
                {icon}
            </div>
        </div>
    );
}