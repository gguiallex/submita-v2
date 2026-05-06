"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function editarEventoAction(formData: FormData) {
    const id = Number(formData.get("id"));
    const edicaoId = Number(formData.get("edicaoId"));

    const sigla = String(formData.get("sigla"));
    const titulo = String(formData.get("titulo"));

    const dataInicioRaw = formData.get("dataInicio");
    const dataFimRaw = formData.get("dataFim");

    const maxRevisoresPorTrabalho = Number(
        formData.get("maxRevisoresPorTrabalho")
    );

    const maxTrabalhosPorRevisor = Number(
        formData.get("maxTrabalhosPorRevisor")
    );

    const exigirResumo = formData.get("exigirResumo") === "on";
    const exigirPdf = formData.get("exigirPdf") === "on";
    const submissaoAnonima = formData.get("submissaoAnonima") === "on";

    await prisma.evento.update({
        where: { id },
        data: {
            sigla,
            titulo,
            dataInicio: dataInicioRaw ? new Date(String(dataInicioRaw)) : null,
            dataFim: dataFimRaw ? new Date(String(dataFimRaw)) : null,
            maxRevisoresPorTrabalho,
            maxTrabalhosPorRevisor,
            exigirResumo,
            exigirPdf,
            submissaoAnonima,
        },
    });

    redirect(`/admin/edicoes/${edicaoId}/eventos/${id}`);
}