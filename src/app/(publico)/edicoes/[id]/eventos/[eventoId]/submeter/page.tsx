import prisma from '@/lib/prisma';
import FormSubmissao from './FormSubmissao'; // Ajuste o caminho se necessário
import { notFound } from 'next/navigation';

export default async function SubmissaoPage({
    params
}: {
    params: Promise<{ id: string, eventoId: string }>
}) {
    // 1. Extrai os dois IDs do parâmetro da URL
    const { id, eventoId } = await params;

    const evento = await prisma.evento.findUnique({
        where: { id: Number(eventoId) },
        include: { temas: true }
    });

    const departamentos = await prisma.departamento.findMany({
        orderBy: { sigla: 'asc' }
    });

    if (!evento) return notFound();

    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <FormSubmissao
                    edicaoId={id}
                    eventoId={eventoId}
                    eventoSigla={evento.sigla}
                    temas={evento.temas}
                    departamentos={departamentos}
                    exigirResumo={evento.exigirResumo}
                    exigirPdf={evento.exigirPdf}
                    submissaoAnonima={evento.submissaoAnonima}
                />
            </div>
        </main>
    );
}