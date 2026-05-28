import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EventNavbar } from '../components/EventNavbar';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import RelatoriosClient from './RelatoriosClient';
import Link from 'next/link';

export default async function RelatoriosPage({
    params,
}: {
    params: Promise<{ id: string; eventoId: string }>;
}) {
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: {
            atribuicoes: {
                include: {
                    submissao: {
                        include: {
                            temas: true,
                        },
                    },
                    revisor: {
                        include: {
                            departamento: {
                                include: {
                                    UnidadeAcademica: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!evento) return notFound();
    console.log('ATRIBUICOES:', evento.atribuicoes.length);

    const revisores = evento.atribuicoes.map((a) => ({
        id: a.revisor.id,
        nome: a.revisor.nome,

        departamento:
            a.revisor.departamento?.sigla ??
            'Sem departamento',

        unidadeAcademica:
            a.revisor.departamento?.UnidadeAcademica?.sigla ??
            'Sem UA',

        artigo: a.submissao.titulo,
    }));

    const artigos = evento.atribuicoes.map((a) => ({
        id: a.submissao.id,
        titulo: a.submissao.titulo,
        revisor: a.revisor.nome,
    }));

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="mb-10">
                <Link
                    href={`/admin/edicoes/${id}`}
                    className="group flex items-center gap-2 text-ufla-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-blue-900 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Edição
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-600 text-white rounded-2xl shadow-lg shadow-cyan-100">
                        <BarChart3 className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            Relatórios
                        </h1>

                        <p className="text-slate-500 font-medium mt-1">
                            Indicadores e visualizações do evento{' '}
                            <span className="text-ufla-blue font-bold">
                                {evento.sigla}
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            <EventNavbar
                edicaoId={id}
                eventoId={eventoId}
            />

            <RelatoriosClient
                revisores={revisores}
                artigos={artigos}
            />
        </div>
    );
}