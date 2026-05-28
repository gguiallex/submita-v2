'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function salvarUA(formData: FormData) {
  const id = formData.get('id');
  const sigla = formData.get('sigla') as string;
  const nome = formData.get('nome') as string;

  if (id) {
    // Editar
    await prisma.unidadeAcademica.update({
      where: { id: Number(id) },
      data: { sigla, nome }
    });
  } else {
    // Criar novo
    await prisma.unidadeAcademica.create({
      data: { sigla, nome }
    });
  }

  revalidatePath('/admin/unidadesAcademicas');
  redirect('/admin/unidadesAcademicas');
}

export async function excluirUA(id: number) {
  try {
    await prisma.unidadeAcademica.delete({ where: { id } });
    revalidatePath('/admin/unidadesAcademicas');
  } catch (error) {
    throw new Error("Não é possível excluir: existem departamentos vinculados.");
  }
}