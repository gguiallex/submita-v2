'use client'

import { Trash2 } from 'lucide-react';
import { excluirEventoAction } from './actions';

interface AcoesEventoProps {
    eventoId: number;
    edicaoId: number;
    sigla: string;
}

export function AcoesEvento({ eventoId, edicaoId, sigla }: AcoesEventoProps) {
    const handleExcluir = async () => {
        const confirmou = confirm(
            `CUIDADO: Você está prestes a excluir o evento "${sigla}".\n\n` +
            `Isso apagará submissões e avaliações permanentemente. Confirmar?`
        );
        
        if (confirmou) {
            await excluirEventoAction(eventoId, edicaoId);
        }
    };

    return (
        <button 
            onClick={handleExcluir}
            title="Excluir Evento" 
            className="p-3 text-slate-300 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}