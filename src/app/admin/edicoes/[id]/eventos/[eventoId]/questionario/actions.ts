'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function adicionarPerguntaAction(formData: FormData) {
    const texto = formData.get('texto') as string;
    const tipo = formData.get('tipo') as string;
    const eventoId = Number(formData.get('eventoId'));
    const edicaoId = formData.get('edicaoId');

    await prisma.pergunta.create({
        data: { texto, tipo, eventoId }
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}

export async function removerPerguntaAction(formData: FormData) {
    const id = Number(formData.get('id'));
    const eventoId = formData.get('eventoId');
    const edicaoId = formData.get('edicaoId');

    await prisma.pergunta.delete({
        where: { id }
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}

export async function editarPerguntaAction(formData: FormData) {
    const id = Number(formData.get('id'));
    const texto = formData.get('texto') as string;
    const tipo = formData.get('tipo') as string;
    const eventoId = formData.get('eventoId');
    const edicaoId = formData.get('edicaoId');

    await prisma.pergunta.update({
        where: { id },
        data: { texto, tipo }
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/questionario`);
}