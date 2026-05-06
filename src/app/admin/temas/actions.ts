'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function salvarTemaGlobal(formData: FormData) {
    const id = formData.get('id');
    const nome = formData.get('nome') as string;

    try {
        if (id && id !== "undefined") {
            await prisma.tema.update({
                where: { id: Number(id) },
                data: { nome }
            });
        } else {
            await prisma.tema.create({
                data: { nome }
            });
        }
    } catch (error: any) {
        // Se o erro for de unicidade (nome repetido)
        if (error.code === 'P2002') {
            redirect('/admin/temas?error=Esta área temática já está cadastrada.');
        }
        // Outros erros
        redirect('/admin/temas?error=Não foi possível salvar as alterações.');
    }

    revalidatePath('/admin/temas');
    redirect('/admin/temas'); // Redireciona para limpar possíveis erros anteriores
}

export async function excluirTemaGlobal(id: number) {
    try {
        await prisma.tema.delete({ where: { id } });
        revalidatePath('/admin/temas');
    } catch (error) {
        redirect('/admin/temas?error=Não é possível excluir um tema vinculado a trabalhos.');
    }
}