'use server' // Isso diz ao Next que esta função só roda no servidor (segurança!)

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarEdicao(formData: FormData) {
  // 1. Pegamos os dados do formulário
  const ano = parseInt(formData.get('ano') as string);

  // 2. Validação básica
  if (!ano) {
    throw new Error("O Ano é obrigatório.");
  }

  // 3. Salvamos no banco usando o Prisma
  await prisma.edicao.create({
    data: { ano },
  });

  // 4. Limpamos o cache da página de listagem para a nova edição aparecer na hora
  revalidatePath('/admin/edicoes');
  
  // 5. Voltamos para a lista
  redirect('/admin/edicoes');
}

export async function copiarEventos(edicaoOrigemId: number, edicaoDestinoId: number) {
  // 1. Buscamos todos os eventos da edição antiga
  const eventosAntigos = await prisma.evento.findMany({
    where: { edicaoId: edicaoOrigemId }
  });

  if (eventosAntigos.length === 0) {
    throw new Error("A edição de origem não possui eventos para copiar.");
  }

  // 2. Criamos as cópias para a nova edição
  // Usamos createMany para ser mais rápido (disponível no SQLite/Prisma)
  const novosEventos = eventosAntigos.map(evento => ({
    titulo: evento.titulo,
    sigla: evento.sigla,
    adminId: evento.adminId, // Mantém o mesmo administrador
    edicaoId: edicaoDestinoId  // Mas vincula à nova edição
  }));

  await prisma.evento.createMany({
    data: novosEventos
  });

  revalidatePath('/admin/edicoes');
}