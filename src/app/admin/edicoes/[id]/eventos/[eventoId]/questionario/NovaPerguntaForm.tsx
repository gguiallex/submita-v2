"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { adicionarPerguntaAction } from "./actions";

export function NovaPerguntaForm({
    eventoId,
    edicaoId,
}: {
    eventoId: string;
    edicaoId: string;
}) {
    const [tipo, setTipo] = useState("ESCALA");

    return (
        <form action={adicionarPerguntaAction} className="space-y-4">
            <input type="hidden" name="eventoId" value={eventoId} />
            <input type="hidden" name="edicaoId" value={edicaoId} />

            <input
                name="texto"
                type="text"
                placeholder="Ex: Qualidade da Metodologia"
                className="w-full p-4 bg-white/10 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 font-bold text-white placeholder:text-slate-500 transition-all"
                required
            />

            <select
                name="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-4 bg-white/10 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
            >
                <option value="ESCALA" className="text-slate-900">Escala (0-10)</option>
                <option value="ABERTA" className="text-slate-900">Resposta Aberta</option>
                <option value="MULTIPLA_ESCOLHA" className="text-slate-900">Múltipla Escolha</option>
            </select>

            {tipo === "MULTIPLA_ESCOLHA" && (
                <input
                    name="opcoes"
                    type="text"
                    placeholder="Ex: Excelente;Bom;Regular;Ruim"
                    className="w-full p-4 bg-white/10 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 font-bold text-white placeholder:text-slate-500 transition-all"
                    required
                />
            )}

            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-400 transition shadow-lg active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                <Plus className="w-5 h-5" />
                Adicionar Critério
            </button>
        </form>
    );
}