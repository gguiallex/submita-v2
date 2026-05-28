'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function salvarDepartamento(formData: FormData) {
    const id = formData.get('id');
    const sigla = formData.get('sigla') as string;
    const nome = formData.get('nome') as string;
    const unidadeAcademicaId = Number(
        formData.get('unidadeAcademicaId')
    );

    if (id) {
        await prisma.departamento.update({
            where: { id: Number(id) },
            data: {
                sigla,
                nome,
                UnidadeAcademicaId: unidadeAcademicaId,
            },
        });
    } else {
        await prisma.departamento.create({
            data: {
                sigla,
                nome,
                UnidadeAcademicaId: unidadeAcademicaId,
            },
        });
    }

    revalidatePath('/admin/departamentos');
    redirect('/admin/departamentos');
}

export async function excluirDepartamento(id: number) {
  try {
    await prisma.departamento.delete({ where: { id } });
    revalidatePath('/admin/departamentos');
  } catch (error) {
    throw new Error("Não é possível excluir: existem usuários ou autores vinculados.");
  }
}