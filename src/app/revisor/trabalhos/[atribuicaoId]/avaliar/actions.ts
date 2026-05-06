"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function salvarAvaliacaoAction(formData: FormData) {
    const atribuicaoId = Number(formData.get("atribuicaoId"));

    const atribuicao = await prisma.atribuicao.findUnique({
        where: { id: atribuicaoId },
        include: {
            submissao: true,
            evento: {
                include: {
                    perguntas: true,
                },
            },
        },
    });

    if (!atribuicao) {
        throw new Error("Atribuição não encontrada.");
    }

    await prisma.resposta.deleteMany({
        where: {
            submissaoId: atribuicao.submissaoId,
            revisorId: atribuicao.revisorId,
        },
    });

    let somaNotas = 0;
    let qtdNotas = 0;

    for (const pergunta of atribuicao.evento.perguntas) {
        const valor = String(formData.get(`pergunta-${pergunta.id}`) || "");

        if (!valor) continue;

        await prisma.resposta.create({
            data: {
                valor,
                perguntaId: pergunta.id,
                submissaoId: atribuicao.submissaoId,
                revisorId: atribuicao.revisorId,
            },
        });

        if (pergunta.tipo === "ESCALA") {
            somaNotas += Number(valor);
            qtdNotas++;
        }
    }

    const notaFinal = qtdNotas > 0 ? somaNotas / qtdNotas : null;

    await prisma.atribuicao.update({
        where: { id: atribuicaoId },
        data: {
            status: "CONCLUIDO",
            notaFinal,
        },
    });

    await prisma.submissao.update({
        where: { id: atribuicao.submissaoId },
        data: {
            status: "AVALIADO",
            mediaFinal: notaFinal ?? 0,
        },
    });

    redirect(`/revisor/edicoes/${atribuicao.evento.edicaoId}/eventos/${atribuicao.eventoId}`);
}