'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function adicionarPerguntaAction(formData: FormData) {
    const texto = String(formData.get('texto'));
    const tipo = String(formData.get('tipo'));
    const opcoes = String(formData.get('opcoes') || '');

    const eventoId = Number(formData.get('eventoId'));
    const edicaoId = String(formData.get('edicaoId'));

    await prisma.pergunta.create({
        data: {
            texto,
            tipo,
            eventoId,
            opcoes: tipo === 'MULTIPLA_ESCOLHA' ? opcoes : null,
        },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}

export async function removerPerguntaAction(formData: FormData) {
    const id = Number(formData.get('id'));
    const eventoId = String(formData.get('eventoId'));
    const edicaoId = String(formData.get('edicaoId'));

    await prisma.pergunta.delete({
        where: { id },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}

export async function editarPerguntaAction(formData: FormData) {
    const id = Number(formData.get('id'));
    const texto = String(formData.get('texto'));
    const tipo = String(formData.get('tipo'));
    const opcoes = String(formData.get('opcoes') || '');

    const eventoId = String(formData.get('eventoId'));
    const edicaoId = String(formData.get('edicaoId'));

    await prisma.pergunta.update({
        where: { id },
        data: {
            texto,
            tipo,
            opcoes: tipo === 'MULTIPLA_ESCOLHA' ? opcoes : null,
        },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}