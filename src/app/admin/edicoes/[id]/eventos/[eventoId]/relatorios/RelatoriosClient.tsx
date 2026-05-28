'use client';

import { useMemo, useState } from 'react';
import GraficoRelatorio from './GraficoRelatorio';

interface Revisor {
    id: number;
    nome: string;
    departamento: string;
    unidadeAcademica: string;
    artigo: string;
}

interface Artigo {
    id: number;
    titulo: string;
    revisor: string;
}

export default function RelatoriosClient({
    revisores,
    artigos,
}: {
    revisores: Revisor[];
    artigos: Artigo[];
}) {
    const [tipo, setTipo] = useState('REVISORES_DEPARTAMENTO');
    const [selecionado, setSelecionado] = useState<string | null>(null);

    const dadosGrafico = useMemo(() => {
        const mapa: Record<string, number> = {};

        switch (tipo) {
            case 'REVISORES_DEPARTAMENTO':
                revisores.forEach((r) => {
                    mapa[r.departamento] =
                        (mapa[r.departamento] || 0) + 1;
                });
                break;

            case 'REVISORES_UA':
                revisores.forEach((r) => {
                    mapa[r.unidadeAcademica] =
                        (mapa[r.unidadeAcademica] || 0) + 1;
                });
                break;

            case 'ARTIGOS_REVISOR':
                revisores.forEach((r) => {
                    mapa[r.nome] =
                        (mapa[r.nome] || 0) + 1;
                });
                break;

            case 'REVISORES_ARTIGO':
                revisores.forEach((r) => {
                    mapa[r.artigo] =
                        (mapa[r.artigo] || 0) + 1;
                });
                break;
        }

        return Object.entries(mapa).map(([nome, total]) => ({
            nome,
            total,
        }));
    }, [tipo, revisores]);

    const dadosFiltrados = useMemo(() => {
        if (!selecionado) return [];

        switch (tipo) {
            case 'REVISORES_DEPARTAMENTO':
                return revisores.filter(
                    (r) => r.departamento === selecionado
                );

            case 'REVISORES_UA':
                return revisores.filter(
                    (r) => r.unidadeAcademica === selecionado
                );

            case 'ARTIGOS_REVISOR':
                return revisores.filter(
                    (r) => r.nome === selecionado
                );

            case 'REVISORES_ARTIGO':
                return revisores.filter(
                    (r) => r.artigo === selecionado
                );

            default:
                return [];
        }
    }, [tipo, revisores, selecionado]);

    return (
        <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                <label
                    htmlFor="tipoRelatorio"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3"
                >
                    Tipo de Relatório
                </label>

                <select
                    id="tipoRelatorio"
                    title="Selecione o tipo de relatório"
                    aria-label="Tipo de relatório"
                    value={tipo}
                    onChange={(e) => {
                        setTipo(e.target.value);
                        setSelecionado(null);
                    }}
                    className="w-full md:w-[320px] bg-slate-100 rounded-2xl px-4 py-4 font-black text-sm outline-none text-slate-400"
                >
                    <option value="REVISORES_DEPARTAMENTO">
                        Revisores por Departamento
                    </option>

                    <option value="REVISORES_UA">
                        Revisores por Unidade Acadêmica
                    </option>

                    <option value="ARTIGOS_REVISOR">
                        Artigos de um Revisor
                    </option>

                    <option value="REVISORES_ARTIGO">
                        Revisores de um Artigo
                    </option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* GRÁFICO */}
                <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">
                        Visualização
                    </h2>

                    <div className="space-y-4">
                        <GraficoRelatorio
                            dados={dadosGrafico}
                            selecionado={selecionado}
                            onSelecionar={setSelecionado}
                        />
                    </div>
                </section>

                {/* LISTAGEM */}
                <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">
                        Listagem
                    </h2>

                    {selecionado ? (
                        <div className="space-y-4">
                            {dadosFiltrados.map((r) => (
                                <div
                                    key={`${r.id}-${r.artigo}`}
                                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                                >
                                    {tipo === 'REVISORES_DEPARTAMENTO' && (
                                        <>
                                            <p className="font-black text-slate-800">
                                                {r.nome}
                                            </p>

                                            <p className="text-xs font-bold text-slate-500 mt-2">
                                                Artigo:
                                            </p>

                                            <p className="text-sm text-slate-700">
                                                {r.artigo}
                                            </p>
                                        </>
                                    )}

                                    {tipo === 'REVISORES_UA' && (
                                        <>
                                            <p className="font-black text-slate-800">
                                                {r.nome}
                                            </p>

                                            <p className="text-xs font-bold text-slate-500 mt-2">
                                                Departamento:
                                            </p>

                                            <p className="text-sm text-slate-700">
                                                {r.departamento}
                                            </p>
                                        </>
                                    )}

                                    {tipo === 'ARTIGOS_REVISOR' && (
                                        <>
                                            <p className="font-black text-slate-800">
                                                {r.artigo}
                                            </p>
                                        </>
                                    )}

                                    {tipo === 'REVISORES_ARTIGO' && (
                                        <>
                                            <p className="font-black text-slate-800">
                                                {r.nome}
                                            </p>

                                            <p className="text-xs font-bold text-slate-500 mt-2">
                                                Departamento:
                                            </p>

                                            <p className="text-sm text-slate-700">
                                                {r.departamento}
                                            </p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-slate-400 font-bold text-sm">
                            Clique em um item do gráfico para visualizar os dados.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}