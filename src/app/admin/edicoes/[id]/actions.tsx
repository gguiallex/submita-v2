'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function excluirEdicaoAction(id: number) {
  try {
    // 1. Apagar os eventos desta edição (isso limpa o caminho para a edição ser deletada)
    // Se o evento tiver submissões, você precisaria apagar as submissões primeiro também.
    await prisma.evento.deleteMany({
      where: { edicaoId: id }
    });

    // 2. Agora sim, apagar a edição
    await prisma.edicao.delete({
      where: { id }
    });

  } catch (e) {
    console.error("Erro ao deletar:", e);
    // Erro amigável para o usuário
    throw new Error("Existem dados vinculados (como trabalhos submetidos) que impedem a exclusão automática.");
  }
  
  revalidatePath('/admin/edicoes');
  redirect('/admin/edicoes');
}

export async function excluirEventoAction(eventoId: number, edicaoId: number) {
    await prisma.evento.delete({
        where: { id: eventoId }
    });
    revalidatePath(`/admin/edicoes/${edicaoId}`);
}