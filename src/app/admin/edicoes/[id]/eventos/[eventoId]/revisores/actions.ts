"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function vincularRevisorEventoAction(formData: FormData) {
    const usuarioId = Number(formData.get("usuarioId"));
    const eventoId = Number(formData.get("eventoId"));
    const edicaoId = String(formData.get("edicaoId"));
    const temasIds = formData.getAll("temasIds").map(Number);

    const vinculoExistente = await prisma.revisorEvento.findFirst({
        where: {
            usuarioId,
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
                usuarioId,
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