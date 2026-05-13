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

export async function atribuirAutomaticamenteAction(formData: FormData) {
    const edicaoId = String(formData.get("edicaoId"));
    const eventoId = Number(formData.get("eventoId"));

    const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        include: {
            submissoes: {
                include: {
                    temas: true,
                    atribuicoes: true,
                },
            },
            revisores: {
                include: {
                    usuario: true,
                    temas: true,
                },
            },
        },
    });

    if (!evento) {
        throw new Error("Evento não encontrado.");
    }

    for (const submissao of evento.submissoes) {
        const temasSubmissaoIds = submissao.temas.map((tema) => tema.id);

        let totalAtual = submissao.atribuicoes.length;

        if (totalAtual >= evento.maxRevisoresPorTrabalho) {
            continue;
        }

        const revisoresCompativeis = evento.revisores
            .filter((revisorEvento) => {
                const jaAtribuido = submissao.atribuicoes.some(
                    (atribuicao) => atribuicao.revisorId === revisorEvento.usuarioId
                );

                if (jaAtribuido) return false;

                const temasRevisorIds = revisorEvento.temas.map((tema) => tema.id);

                return temasRevisorIds.some((temaId) =>
                    temasSubmissaoIds.includes(temaId)
                );
            })
            .sort((a, b) => a.usuarioId - b.usuarioId);

        for (const revisorEvento of revisoresCompativeis) {
            if (totalAtual >= evento.maxRevisoresPorTrabalho) {
                break;
            }

            const totalTrabalhosDoRevisor = await prisma.atribuicao.count({
                where: {
                    eventoId,
                    revisorId: revisorEvento.usuarioId,
                },
            });

            if (totalTrabalhosDoRevisor >= evento.maxTrabalhosPorRevisor) {
                continue;
            }

            await prisma.atribuicao.create({
                data: {
                    eventoId,
                    submissaoId: submissao.id,
                    revisorId: revisorEvento.usuarioId,
                    status: "PENDENTE",
                },
            });

            totalAtual++;
        }
    }

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/atribuicoes`);
}