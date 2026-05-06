"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function adicionarRevisorAction(formData: FormData) {
    const nome = String(formData.get("nome"));
    const email = String(formData.get("email"));
    const departamentoId = Number(formData.get("departamentoId"));
    const eventoId = Number(formData.get("eventoId"));
    const edicaoId = String(formData.get("edicaoId"));

    const temasIds = formData.getAll("temasIds").map(Number);

    const usuario = await prisma.usuario.upsert({
        where: { email },
        update: {
            nome,
            role: "REVISOR",
            departamentoId,
        },
        create: {
            nome,
            email,
            role: "REVISOR",
            departamentoId,
        },
    });

    const vinculoExistente = await prisma.revisorEvento.findFirst({
        where: {
            usuarioId: usuario.id,
            eventoId,
        },
    });

    if (vinculoExistente) {
        await prisma.revisorEvento.update({
            where: { id: vinculoExistente.id },
            data: {
                temas: {
                    set: temasIds.map((id) => ({ id })),
                },
            },
        });
    } else {
        await prisma.revisorEvento.create({
            data: {
                usuarioId: usuario.id,
                eventoId,
                temas: {
                    connect: temasIds.map((id) => ({ id })),
                },
            },
        });
    }

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/revisores`);
}

export async function removerRevisorEventoAction(formData: FormData) {
    const revisorEventoId = Number(formData.get("revisorEventoId"));
    const eventoId = Number(formData.get("eventoId"));
    const edicaoId = String(formData.get("edicaoId"));

    await prisma.revisorEvento.delete({
        where: { id: revisorEventoId },
    });

    revalidatePath(`/admin/edicoes/${edicaoId}/eventos/${eventoId}/revisores`);
}