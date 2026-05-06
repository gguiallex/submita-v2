'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function salvarRevisorMestre(formData: FormData) {
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const departamentoId = Number(formData.get('departamentoId'));
    const temasIds = JSON.parse(formData.get('temasData') as string) as number[];

    await prisma.usuario.upsert({
        where: { email },
        update: {
            nome,
            departamentoId,
            role: 'REVISOR',
            especialidades: {
                set: [], // Reseta as expertises para atualizar
                connect: temasIds.map(id => ({ id }))
            }
        },
        create: {
            nome,
            email,
            departamentoId,
            role: 'REVISOR',
            especialidades: {
                connect: temasIds.map(id => ({ id }))
            }
        }
    });

    revalidatePath('/admin/revisores');
}

export async function excluirRevisorMestre(id: number) {
    await prisma.usuario.delete({
        where: { id }
    });
    revalidatePath('/admin/revisores');
}