'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarEvento(formData: FormData) {
  // 1. Coleta os dados do formulário
  const titulo = formData.get('titulo') as string;
  const sigla = formData.get('sigla') as string;
  const edicaoId = parseInt(formData.get('edicaoId') as string);
  const adminId = parseInt(formData.get('adminId') as string);

  // 2. Validação simples
  if (!titulo || !sigla || !edicaoId || !adminId) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  // 3. Cria o evento conectado à Edição e ao Usuário
  await prisma.evento.create({
    data: {
      titulo,
      sigla,
      edicaoId, // FK para Edicao
      adminId,  // FK para Usuario
    },
  });

  // 4. Atualiza a lista de edições
  revalidatePath('/admin/edicoes');
  redirect('/admin/edicoes');
}