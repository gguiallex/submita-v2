'use server'

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function submeterTrabalho(formData: FormData) {
  // 1. Coleta os dados básicos
  const titulo = formData.get('titulo') as string;
  const resumo = formData.get('resumo') as string;
  const palavrasChave = formData.get('palavrasChave') as string;
  const eventoId = Number(formData.get('eventoId'));

  // 2. Captura os dados JSON (Múltiplos Autores e Temas)
  const autoresDataRaw = formData.get('autoresData') as string;
  const temasDataRaw = formData.get('temasData') as string;

  // Transformamos as strings JSON em arrays reais
  const autoresArray = JSON.parse(autoresDataRaw || '[]');
  const temasIdsArray = JSON.parse(temasDataRaw || '[]') as number[];

  // 3. Coleta o arquivo (Simulado)
  const arquivo = formData.get('arquivo') as File;
  const nomeArquivo = arquivo && arquivo.name !== 'undefined' ? arquivo.name : "documento.pdf";

  // 4. Salva a SUBMISSÃO com as novas relações
  await prisma.submissao.create({
    data: {
      titulo: titulo,
      resumo: resumo,
      palavrasChave: palavrasChave || "",
      arquivoUrl: nomeArquivo,
      status: "SUBMETIDO",
      evento: {
        connect: { id: eventoId }
      },

      autores: {
        create: autoresArray.map((a: any) => ({
          nome: a.nome,
          email: a.email,
          // CORREÇÃO AQUI: Conectando pela sigla do departamento
          departamento: {
            connect: { sigla: a.departamento }
          }
        }))
      },

      temas: {
        connect: temasIdsArray.map((id: number) => ({ id }))
      }
    }
  });

  // 5. Limpa o cache para os dados aparecerem no Admin
  revalidatePath('/admin/edicoes');

  // 6. Redireciona para a página de edições públicas com sucesso
  // Dica: Verifique se o caminho de redirecionamento está correto conforme sua estrutura de pastas
  redirect('/admin/edicoes?sucesso=true');
}