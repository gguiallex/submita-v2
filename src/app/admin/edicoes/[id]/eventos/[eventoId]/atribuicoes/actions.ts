"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function atribuirRevisorAction(formData: FormData) {
    const edicaoId = String(formData.get("edicaoId"));
    const eventoId = Number(formData.get("eventoId"));
    const submissaoId = Number(formData.get("submissaoId"));
    const revisorId = Number(formData.get("revisorId"));

    const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
    });

    if (!evento) {
        throw new Error("Evento não encontrado.");
    }

    const jaExiste = await prisma.atribuicao.findUnique({
        where: {
            submissaoId_revisorId: {
                submissaoId,
                revisorId,
            },
        },
    });

    if (jaExiste) {
        throw new Error("Este revisor já foi atribuído a este trabalho.");
    }

    const totalRevisoresNoTrabalho = await prisma.atribuicao.count({
        where: { submissaoId },
    });

    if (totalRevisoresNoTrabalho >= evento.maxRevisoresPorTrabalho) {
        throw new Error("Este trabalho já atingiu o limite máximo de revisores.");
    }

    const totalTrabalhosDoRevisor = await prisma.atribuicao.count({
        where: {
            eventoId,
            revisorId,
        },
    });

    if (totalTrabalhosDoRevisor >= evento.maxTrabalhosPorRevisor) {
        throw new Error("Este revisor já atingiu o limite máximo de trabalhos.");
    }

    await prisma.atribuicao.create({
        data: {
            eventoId,
            submissaoId,
            revisorId,
            status: "PENDENTE",
        },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/atribuicoes`);
}

export async function removerAtribuicaoAction(formData: FormData) {
    const edicaoId = String(formData.get("edicaoId"));
    const eventoId = Number(formData.get("eventoId"));
    const atribuicaoId = Number(formData.get("atribuicaoId"));

    await prisma.atribuicao.delete({
        where: { id: atribuicaoId },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/atribuicoes`);
}