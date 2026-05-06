// src/app/admin/edicoes/[id]/eventos/[eventoId]/temas/actions.ts
'use server'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function vincularTemaAction(formData: FormData) {
    const eventoId = Number(formData.get('eventoId'));
    const edicaoId = formData.get('edicaoId');
    const temasIds = formData.getAll('temasIds').map(id => ({ id: Number(id) }));

    // Atualiza o evento desconectando o que não foi marcado e conectando os novos
    await prisma.evento.update({
        where: { id: eventoId },
        data: {
            temas: {
                set: temasIds // O 'set' substitui a lista atual pela nova lista selecionada
            }
        }
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/temas`);
    redirect(`/admin/edicoes/${edicaoId}`);
}