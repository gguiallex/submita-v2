'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function salvarAvaliacao(formData: FormData) {
  const id = Number(formData.get('id'));
  const eventoId = Number(formData.get('eventoId'));
  
  const n1 = parseFloat(formData.get('originalidade') as string);
  const n2 = parseFloat(formData.get('metodologia') as string);
  const n3 = parseFloat(formData.get('redacao') as string);

  // Cálculo da Média Aritmética Simples
  const media = (n1 + n2 + n3) / 3;

  // Define status automático: >= 7 APROVADO, < 7 REPROVADO
  const status = media >= 7 ? 'APROVADO' : 'REPROVADO';

  await prisma.submissao.update({
    where: { id },
    data: {
      notaOriginalidade: n1,
      notaMetodologia: n2,
      notaRedacao: n3,
      mediaFinal: media,
      status: status
    }
  });

  revalidatePath(`/admin/eventos/${eventoId}`);
  redirect(`/admin/eventos/${eventoId}`);
}