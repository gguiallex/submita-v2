'use client'

import { excluirEdicaoAction } from './actions'; // Vamos criar esse arquivo já já

export function BotoesAcao({ edicaoId }: { edicaoId: number }) {
  const handleExcluir = async () => {
    const confirmacao = confirm(
      "ATENÇÃO: Deseja realmente excluir esta edição?\n\n" +
      "Isso apagará permanentemente todos os eventos e submissões vinculados."
    );
    
    if (confirmacao) {
      await excluirEdicaoAction(edicaoId);
    }
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={handleExcluir}
        className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition text-sm border-red-100"
      >
        Excluir Edição
      </button>
    </div>
  );
}