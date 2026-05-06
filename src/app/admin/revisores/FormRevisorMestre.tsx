// src/app/admin/revisores/FormRevisorMestre.tsx
'use client'

import { useState } from 'react';
import { salvarRevisorMestre } from './actions';
import { UserPlus, Check } from 'lucide-react';

export default function FormRevisorMestre({ departamentos, temasGlobais }: any) {
    const [temasSelecionados, setTemasSelecionados] = useState<number[]>([]);

    const toggleTema = (id: number) => {
        setTemasSelecionados(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    return (
        <form action={salvarRevisorMestre} className="space-y-4">
            <input type="hidden" name="temasData" value={JSON.stringify(temasSelecionados)} />
            
            <input name="nome" required placeholder="Nome Completo" className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 text-white font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-400 outline-none" />
            <input name="email" type="email" required placeholder="E-mail Institucional" className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 text-white font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-blue-400 outline-none" />
            
            <select name="departamentoId" required title="Selecione o Departamento" className="w-full bg-white/10 border-none rounded-2xl py-4 px-6 text-slate-400 font-bold focus:ring-2 focus:ring-blue-400 outline-none appearance-none">
                <option value="" className="text-slate-900">Depto</option>
                {departamentos.map((d: any) => <option key={d.id} value={d.id} className="text-slate-900">{d.sigla}</option>)}
            </select>

            <div className="space-y-2">
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest ml-1">Especialidades</p>
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 max-h-40 overflow-y-auto">
                    {temasGlobais.map((t: any) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTema(t.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                temasSelecionados.includes(t.id) ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'
                            }`}
                        >
                            {t.nome}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-400 transition-all">
                Cadastrar Revisor
            </button>
        </form>
    );
}