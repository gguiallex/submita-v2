'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function adicionarRevisorAction(formData: FormData) {
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const departamentoId = Number(formData.get('departamentoId'));
    const eventoId = Number(formData.get('eventoId'));
    const temasIds = JSON.parse(formData.get('temasIds') as string) as number[];

    // 1. Cria ou recupera o Usuário (baseado no email único)
    const usuario = await prisma.usuario.upsert({
        where: { email },
        update: { role: 'REVISOR', departamentoId },
        create: { nome, email, role: 'REVISOR', departamentoId }
    });

    // 2. Vincula o Usuário como Revisor deste Evento
    await prisma.revisorEvento.create({
        data: {
            usuarioId: usuario.id,
            eventoId: eventoId,
            temas: {
                connect: temasIds.map(id => ({ id }))
            }
        }
    });

    revalidatePath(`/admin/edicoes/[id]/eventos/${eventoId}/revisores`);
}