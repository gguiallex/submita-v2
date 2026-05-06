import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  ChevronRight
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
                select: { submissoes: true, perguntas: true, temas: true }
            },
            submissoes: {
                include: { respostas: true }
            },
            temas: {
                include: { _count: { select: { submissoes: true } } }
            }
        }
    });

    if (!evento) return notFound();

    // Cálculos para o Dashboard
    const totalSubmissoes = evento._count.submissoes;
    const avaliados = evento.submissoes.filter(s => s.respostas.length > 0).length;
    const pendentes = totalSubmissoes - avaliados;
    const taxaAvaliacao = totalSubmissoes > 0 ? Math.round((avaliados / totalSubmissoes) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <header className="mb-10">
                <Link 
                    href={`/admin/edicoes/${id}`} 
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Ciclo
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {evento.sigla}
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-lg">{evento.titulo}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                        <Calendar className="w-4 h-4 text-ufla-blue" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Edição {id}</span>
                    </div>
                </div>
            </header>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total de Trabalhos" value={totalSubmissoes} icon={<FileText />} color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Avaliados" value={avaliados} icon={<CheckCircle2 />} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Pendentes" value={pendentes} icon={<AlertCircle />} color="text-amber-600" bg="bg-amber-50" />
                <StatCard label="Progresso" value={`${taxaAvaliacao}%`} icon={<TrendingUp />} color="text-indigo-600" bg="bg-indigo-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna de Gráfico/Distribuição Temática */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-ufla-blue" />
                            Distribuição por Área
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {evento.temas.map(tema => {
                            const porcentagem = totalSubmissoes > 0 ? (tema._count.submissoes / totalSubmissoes) * 100 : 0;
                            return (
                                <div key={tema.id}>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                        <span className="text-slate-600">{tema.nome}</span>
                                        <span className="text-ufla-blue">{tema._count.submissoes}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-ufla-blue h-full rounded-full transition-all duration-1000" 
                                            style={{ width: `${porcentagem}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Coluna de Atalhos Rápidos */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">Acesso Rápido</h2>
                    <QuickLink 
                        href={`/admin/edicoes/${id}/eventos/${eventoId}/trabalhos`}
                        label="Ver Submissões"
                        desc="Gerencie todos os arquivos"
                        icon={<FileText className="text-amber-600" />}
                    />
                    <QuickLink 
                        href={`/admin/edicoes/${id}/eventos/${eventoId}/questionario`}
                        label="Editar Barema"
                        desc="Perguntas de avaliação"
                        icon={<TrendingUp className="text-indigo-600" />}
                    />
                    <QuickLink 
                        href={`/admin/edicoes/${id}/eventos/${eventoId}/temas`}
                        label="Áreas Temáticas"
                        desc="Categorias do evento"
                        icon={<Users className="text-emerald-600" />}
                    />
                </div>
            </div>
        </div>
    );
}

// Componentes Auxiliares (podem ficar no mesmo arquivo ou em /components)
function StatCard({ label, value, icon, color, bg }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function QuickLink({ href, label, desc, icon }: any) {
    return (
        <Link href={href} className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-ufla-blue transition-all shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <p className="font-black text-slate-800 text-sm">{label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{desc}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-ufla-blue group-hover:translate-x-1 transition-all" />
        </Link>
    );
}