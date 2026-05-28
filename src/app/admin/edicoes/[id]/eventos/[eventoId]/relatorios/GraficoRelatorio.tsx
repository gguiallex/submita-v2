'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function GraficoRelatorio({
    dados,
    selecionado,
    onSelecionar
}: {
    dados: {
        nome: string;
        total: number;
    }[];
    selecionado: string | null;
    onSelecionar: (nome: string) => void;
}) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={dados}
                layout="vertical"
                margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10
                }}
            >
                <XAxis type="number" />

                <YAxis
                    type="category"
                    dataKey="nome"
                    width={120}
                />

                <Tooltip />

                <Bar
                    dataKey="total"
                    radius={[0, 10, 10, 0]}
                    onClick={(data: any) =>
                        onSelecionar(data.payload.nome)
                    }
                >
                    {dados.map((d) => (
                        <Cell
                            key={d.nome}
                            fill={
                                selecionado === d.nome
                                    ? '#003366'
                                    : '#6b7280'
                            }
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}